// server/app.js
const express = require("express");
const cors = require("cors");
const recruiterRoutes = require("./routes/recruiterRoutes");

const app = express();

app.use(cors({
    origin: 'https://recruiter-registaration-and-verification.vercel.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));
app.use(express.json());

app.use("/api/recruiters", recruiterRoutes);

module.exports = app;
