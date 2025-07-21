// immo/FE/src/features/utils/authEvent.ts
// кастомное событие для авторизации
export const authEvents = {
  // Login event
  login: new CustomEvent('admin-login'),

  // Logout event
  logout: new CustomEvent('admin-logout'),
};

// Sending a login event
export const dispatchLoginEvent = (): void => {
  window.dispatchEvent(authEvents.login);
};

// Sending a logout event
export const dispatchLogoutEvent = (): void => {
  //clear sessionStorage
  sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminInfo');
  window.dispatchEvent(authEvents.logout);
};

// checking authorization
export const isAuthenticated = (): boolean => {
  return !!sessionStorage.getItem('adminToken');
};

// getting user information
export const getAdminInfo = (): any | null => {
  const adminInfo = sessionStorage.getItem('adminInfo');
  return adminInfo ? JSON.parse(adminInfo) : null;
};

// getting  token
export const getAdminToken = (): string | null => {
  return sessionStorage.getItem('adminToken');
};

// Clear when closing the browser for additional protection
export const setupAutoLogout = (): void => {
  // Browser/Tab Close Event Listener
  window.addEventListener('beforeunload', () => {
    // sessionStorage is automatically cleared, but we can add logic
    console.log('Браузер закрывается, сессия будет очищена');
  });

  // Check every 30 seconds that the token still exists
  setInterval(() => {
    if (!isAuthenticated()) {
      // If the token has disappeared, send an exit event
      dispatchLogoutEvent();
    }
  }, 30000);
};
