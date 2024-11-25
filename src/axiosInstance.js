// src/axiosInstance.js
import axios from 'axios';

const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://z8z9mqgwpa.ap-northeast-1.awsapprunner.com'
  : 'http://localhost:5000';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userDetails');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add WebSocket URL configuration
export const WS_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'wss://z8z9mqgwpa.ap-northeast-1.awsapprunner.com'
  : 'ws://localhost:5000';

export default axiosInstance;
