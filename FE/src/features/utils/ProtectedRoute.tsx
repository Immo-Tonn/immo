import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem('adminToken');

  if (!isAuthenticated) {
    return <Navigate to="/add-property" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
