// immo/FE/src/features/utils/authEvent.ts
// Простой механизм глобальных событий авторизации для взаимодействия между компонентами

// Создаем кастомное событие для авторизации
export const authEvents = {
  // Событие входа в систему
  login: new CustomEvent('admin-login'),

  // Событие выхода из системы
  logout: new CustomEvent('admin-logout'),
};

// Функция для отправки события входа в систему
export const dispatchLoginEvent = (): void => {
  window.dispatchEvent(authEvents.login);
};

// Функция для отправки события выхода из системы
export const dispatchLogoutEvent = (): void => {
  //очистка sessionStorage
  sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminInfo');
  window.dispatchEvent(authEvents.logout);
};

// ДОБАВЛЕНО: Функция для проверки авторизации
export const isAuthenticated = (): boolean => {
  return !!sessionStorage.getItem('adminToken');
};

// ДОБАВЛЕНО: Функция для получения информации о пользователе
export const getAdminInfo = (): any | null => {
  const adminInfo = sessionStorage.getItem('adminInfo');
  return adminInfo ? JSON.parse(adminInfo) : null;
};

// ДОБАВЛЕНО: Функция для получения токена
export const getAdminToken = (): string | null => {
  return sessionStorage.getItem('adminToken');
};

// ДОБАВЛЕНО: Автоматическая очистка при закрытии браузера
// Это обеспечивает дополнительную защиту
export const setupAutoLogout = (): void => {
  // Слушатель события закрытия браузера/вкладки
  window.addEventListener('beforeunload', () => {
    // sessionStorage автоматически очищается, но мы можем добавить логику
    console.log('Браузер закрывается, сессия будет очищена');
  });

  // Проверка каждые 30 секунд, что токен все еще существует
  setInterval(() => {
    if (!isAuthenticated()) {
      // Если токен исчез, отправляем событие выхода
      dispatchLogoutEvent();
    }
  }, 30000); // 30 секунд
};