import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to append JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campus_iq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiration / unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('campus_iq_token');
      localStorage.removeItem('campus_iq_user');
    }
    return Promise.reject(error);
  }
);

export default API;
