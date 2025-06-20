import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Проверка наличия токена в localStorage
  const isAuthenticated = !!sessionStorage.getItem('adminToken');

  // Если токен отсутствует, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/add-property" replace />;
  }

  // Если токен есть, рендерим защищенный компонент
  return <>{children}</>;
};

export default ProtectedRoute;
