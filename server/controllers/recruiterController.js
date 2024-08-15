// server/controllers/recruiterController.js
const Recruiter = require("../models/Recruiter");
const {
  sendVerificationEmail,
  sendOTP,
  sendLoginAlert,
  sendApprovalEmail,
  sendDocumentsVerificationEmail,
  sendRejectionEmail,
} = require("../services/emailService");
const { generateOTP } = require("../services/otpService");
const { encryptData, decryptData } = require("../services/encryptionService");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      fullName,
      companyName,
      email,
      jobTitle,
      contactNumber,
      companyWebsite,
      password,
      agreedToTerms,
    } = req.body;

    if (!email.includes("@") || email.split("@")[1].split(".").length < 2) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!agreedToTerms) {
      return res
        .status(400)
        .json({ message: "You must agree to the terms and conditions" });
    }

    const recruiter = new Recruiter({
      fullName,
      companyName,
      email,
      jobTitle,
      contactNumber,
      companyWebsite,
      password,
      agreedToTerms,
      verificationToken: Math.random().toString(36).substring(2, 15),
      isDocumentVerified: false,
    });

    await recruiter.save();
    await sendVerificationEmail(recruiter.email, recruiter.verificationToken);

    res.status(201).json({
      message:
        "Recruiter registered successfully. Please check your email for verification.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering recruiter", error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log(token);

    const recruiter = await Recruiter.findOne({ verificationToken: token });
    console.log(recruiter);

    if (!recruiter) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    recruiter.isVerified = true;
    // recruiter.verificationToken = undefined;
    await recruiter.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    const recruiter = await Recruiter.findOne({ email });
    console.log(!recruiter);
    console.log(!recruiter.isVerified);
    console.log(!recruiter.isApproved);
    if (!recruiter || !recruiter.isVerified || !recruiter.isApproved) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const otp = generateOTP();
    const encryptedOTP = encryptData(otp);

    res.status(200).json({ message: "OTP sent to your email", encryptedOTP });

    await sendOTP(recruiter.email, otp);
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, encryptedOTP } = req.body;
    const decryptedOTP = decryptData(encryptedOTP);

    if (otp !== decryptedOTP) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const recruiter = await Recruiter.findOne({ email });
    recruiter.lastLogin = new Date();
    await recruiter.save();
    await sendLoginAlert(recruiter.email, new Date(), req.ip);

    const token = jwt.sign({ id: recruiter._id }, "mani", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

exports.uploadVerificationDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    const recruiter = await Recruiter.findById(req.recruiterId);
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found." });
    }

    const documents = req.files.map((file) => ({
      name: file.originalname,
      data: file.buffer.toString("base64"),
      contentType: file.mimetype,
    }));

    recruiter.verificationDocuments.push(...documents);
    await recruiter.save();

    res
      .status(200)
      .json({ message: "Documents uploaded and saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading documents", error: error.message });
  }
};

exports.rejectRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { reason } = req.body;

    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    recruiter.isApproved = false;
    recruiter.rejectionReason = reason;
    await recruiter.save();

    await sendRejectionEmail(recruiter.email, reason);

    res.status(200).json({ message: "Recruiter rejected successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting recruiter", error: error.message });
  }
};

exports.getNewRecruiterCount = async (req, res) => {
  try {
    const count = await Recruiter.countDocuments({
      isVerified: true,
      isApproved: false,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching new recruiter count",
      error: error.message,
    });
  }
};

exports.approveRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const recruiter = await Recruiter.findById(recruiterId);
    recruiter.isApproved = true;
    await recruiter.save();
    await sendApprovalEmail(recruiter.email);
    res.status(200).json({ message: "Recruiter approved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving recruiter", error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.recruiterId);

    if (!recruiter) {
      return res.status(404).json({ message: "Profile not found" });
    }

    recruiter.verificationDocuments = recruiter.verificationDocuments.map(
      (doc) => {
        try {
          return {
            ...doc,
            data: Buffer.from(doc.data, "base64").toString("utf-8"),
          };
        } catch (err) {
          console.error("Failed to decode Base64 string:", err);
          return { ...doc, data: null }; // Handle error appropriately
        }
      }
    );

    res.status(200).json({
      fullName: recruiter.fullName,
      email: recruiter.email,
      isDocumentVerified: recruiter.isDocumentVerified,
      verificationDocuments: recruiter.verificationDocuments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

exports.verifyRecruiterDocuments = async (req, res) => {
  try {
    const recruiterId = req.params.recruiterId;
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    recruiter.verificationDocuments = recruiter.verificationDocuments.map(
      (doc) => {
        try {
          return {
            ...doc,
            data: Buffer.from(doc.data, "base64").toString("utf-8"),
          };
        } catch (err) {
          console.error("Failed to decode Base64 string:", err);
          return { ...doc, data: null };
        }
      }
    );

    recruiter.isDocumentVerified = true;
    await recruiter.save();
    await sendDocumentsVerificationEmail(recruiter.email);

    res.json({ message: "Documents verified successfully", recruiter });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUnverifiedRecruiters = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;
    const skip = (page - 1) * limit;

    const recruiters = await Recruiter.find({
      isVerified: true,
      isApproved: false,
    })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .select("fullName companyName email jobTitle companyWebsite createdAt");

    const totalRecruiters = await Recruiter.countDocuments({
      isVerified: true,
      isApproved: false,
    });

    res.status(200).json({
      recruiters,
      totalPages: Math.ceil(totalRecruiters / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching unverified recruiters",
      error: error.message,
    });
  }
};

exports.getUnverifiedDocuments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;
    const skip = (page - 1) * limit;

    const recruiters = await Recruiter.find({
      isVerified: true,
      isApproved: true,
      isDocumentVerified: false,
    })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .select(
        "fullName companyName email jobTitle companyWebsite verificationDocuments createdAt"
      );

    const totalRecruiters = await Recruiter.countDocuments({
      isVerified: true,
      isApproved: true,
      isDocumentVerified: false,
    });

    const recruitersWithEncodedDocs = recruiters.map((recruiter) => {
      const recruiterObject = recruiter.toObject();
      recruiterObject.verificationDocuments =
        recruiterObject.verificationDocuments.map((doc) => ({
          ...doc,
          data: doc.data.toString("base64"),
        }));
      return recruiterObject;
    });

    res.status(200).json({
      recruiters: recruitersWithEncodedDocs,
      totalPages: Math.ceil(totalRecruiters / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching unverified documents",
      error: error.message,
    });
  }
};
