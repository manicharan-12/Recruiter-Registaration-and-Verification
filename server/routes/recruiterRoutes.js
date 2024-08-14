const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiterController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/register", recruiterController.register);
router.get("/verify/:token", recruiterController.verifyEmail);
router.post("/login", recruiterController.login);
router.post("/verify-otp", recruiterController.verifyOTP);
router.post(
  "/upload-documents",
  auth,
  upload.array("documents", 5),
  recruiterController.uploadVerificationDocuments
);
router.get("/admin/recruiters", recruiterController.getRecruiters);
router.put("/admin/approve/:recruiterId", recruiterController.approveRecruiter);
router.put("/admin/verify-documents/:recruiterId", recruiterController.verifyRecruiterDocuments); // Verify recruiter documents
router.get("/profile", auth, recruiterController.getProfile);

module.exports = router;
