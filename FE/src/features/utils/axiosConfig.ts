import axios from 'axios';
// axios instance with base url and settings
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_HOST}/api`, // Адрес API-сервера
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Interceptor for adding token to request headers
axiosInstance.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('adminToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
// Interceptor for handling response errors
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Error logging for debugging
    console.error('Ошибка запроса:', error.response?.data || error.message);

    // If token is invalid (401) or expired
    if (error.response && error.response.status === 401) {
      // Check this is not a login/registration request
      const url = error.config?.url || '';
      if (
        !url.includes('/auth/add-property') &&
        !url.includes('/auth/register')
      ) {
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminInfo');
        window.location.href = '/add-property';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
