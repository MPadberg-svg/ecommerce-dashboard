import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fictional-guide-q7wrg494q56xc9pjw-5000.app.github.dev/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// This interceptor automatically attaches your JWT token to requests if the user is logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;