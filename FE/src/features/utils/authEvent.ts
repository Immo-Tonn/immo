export const authEvents = {
  login: new CustomEvent('admin-login'),

  logout: new CustomEvent('admin-logout'),
};

export const dispatchLoginEvent = (): void => {
  window.dispatchEvent(authEvents.login);
};

export const dispatchLogoutEvent = (): void => {
  //очистка sessionStorage
  sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminInfo');
  window.dispatchEvent(authEvents.logout);
};

export const isAuthenticated = (): boolean => {
  return !!sessionStorage.getItem('adminToken');
};

export const getAdminInfo = (): any | null => {
  const adminInfo = sessionStorage.getItem('adminInfo');
  return adminInfo ? JSON.parse(adminInfo) : null;
};

export const getAdminToken = (): string | null => {
  return sessionStorage.getItem('adminToken');
};

export const setupAutoLogout = (): void => {
  window.addEventListener('beforeunload', () => {
    console.log('Браузер закрывается, сессия будет очищена');
  });

  setInterval(() => {
    if (!isAuthenticated()) {
      dispatchLogoutEvent();
    }
  }, 30000);
};
