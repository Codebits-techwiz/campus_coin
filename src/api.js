import axios from 'axios';

// The backend is running on port 5000 by default (as per 00-START-HERE.md)
// In production, Vite injects VITE_API_URL
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL,
  // CRITICAL: Required for sending and receiving the httpOnly cookie for JWT auth
  withCredentials: true,
});

export default api;
