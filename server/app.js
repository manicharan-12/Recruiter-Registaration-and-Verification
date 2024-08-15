// server/app.js
const express = require("express");
const cors = require("cors");
const recruiterRoutes = require("./routes/recruiterRoutes");

const app = express();
//https://recruiter-registaration-and-verification.vercel.app
// http://localhost:3000
app.use(
  cors({
    origin: "https://recruiter-registaration-and-verification.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/recruiters", recruiterRoutes);

module.exports = app;
