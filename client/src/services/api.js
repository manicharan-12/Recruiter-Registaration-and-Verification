// client/src/services/api.js
import axios from "axios";
//https://recruiter-registaration-and-verification.onrender.com
//http://localhost:5000/api
const API_URL = "https://recruiter-registaration-and-verification.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
