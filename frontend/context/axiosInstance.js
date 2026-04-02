import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.17:8000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Aquí es donde en el futuro agregarás el token de Auth
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;