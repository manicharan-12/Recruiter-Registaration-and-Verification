// server/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Configure your email service here
  service: 'Gmail',
  auth: {
    user: 'gade.manicharan12@gmail.com',
    pass: 'eghd jrrw awkt iate',
  },
});

exports.sendVerificationEmail = async (email, token) => {
  const mailOptions = {
    from: 'noreply@recruiterportal.com',
    to: email,
    subject: 'Verify your email',
    html: `<p>Please click <a href="http://localhost:3000/verify/${token}">here</a> to verify your email.</p>`
  };

  await transporter.sendMail(mailOptions);
};

exports.sendOTP = async (email, otp) => {
  const mailOptions = {
    from: 'noreply@recruiterportal.com',
    to: email,
    subject: 'Your OTP for login',
    html: `<p>Your OTP is: ${otp}</p>`
  };

  await transporter.sendMail(mailOptions);
};

exports.sendLoginAlert = async (email, time, ip) => {
  const mailOptions = {
    from: 'noreply@recruiterportal.com',
    to: email,
    subject: 'New Login Alert',
    html: `<p>A new login was detected on your account at ${time} from IP: ${ip}</p>`
  };

  await transporter.sendMail(mailOptions);
};