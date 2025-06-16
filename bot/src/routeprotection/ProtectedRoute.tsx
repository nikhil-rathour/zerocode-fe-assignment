// src/components/ProtectedRoute.tsx

import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn() ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
