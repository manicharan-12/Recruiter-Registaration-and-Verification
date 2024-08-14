// server/app.js
const express = require("express");
const cors = require("cors");
const recruiterRoutes = require("./routes/recruiterRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/recruiters", recruiterRoutes);

module.exports = app;
