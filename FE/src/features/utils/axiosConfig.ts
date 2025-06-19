import axios from 'axios';
// экземпляр axios с базовым URL и настройками
const axiosInstance = axios.create({
  // базовый URL
  baseURL: `${import.meta.env.VITE_HOST}/api`, // Адрес API-сервера
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Интерцептор для добавления токена в заголовки запросов
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
// Интерцептор для обработки ошибок ответа
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Логирование ошибок для отладки
    console.error('Ошибка запроса:', error.response?.data || error.message);

    // Если токен недействителен (401) или истек срок действия
    if (error.response && error.response.status === 401) {
      // Проверяем, что это не запрос входа/регистрации
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
