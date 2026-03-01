import axios from "axios";

const deployedBaseURL = import.meta.env.VITE_BACKEND_URL;
const localBaseURL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: deployedBaseURL,
  withCredentials: true
});

// Add a response interceptor to fallback to local backend if deployed fails
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Only retry once, and only for network errors or 5xx
    if (!originalRequest._retry && localBaseURL && originalRequest.baseURL === deployedBaseURL) {
      originalRequest._retry = true;
      originalRequest.baseURL = localBaseURL;
      try {
        return await axios(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
