// client/src/services/api.js
import axios from 'axios';

const API_URL =  'https://recruiter-registaration-and-verification.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;