// Axios instance for backend API
import axios from "axios";

// Prefer environment variable, fallback to localhost:5000
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  // You can add timeouts or interceptors here if needed
});

export default api;