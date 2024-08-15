// server/models/Recruiter.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
});

const RecruiterSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  jobTitle: { type: String, required: true },
  contactNumber: { type: String, required: true },
  companyWebsite: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationDocuments: [DocumentSchema],
  isDocumentVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  agreedToTerms: { type: Boolean, required: true },
  lastLogin: Date,
});

RecruiterSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Recruiter", RecruiterSchema);
