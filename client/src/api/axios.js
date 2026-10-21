import axios from 'axios';

// Uses the deployed backend in production, localhost in development
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://mern-ecommerce-n9l6.onrender.com/',
});

API.interceptors.request.use(
  (config) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.token) {
      config.headers.Authorization = `Bearer ${storedUser.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;