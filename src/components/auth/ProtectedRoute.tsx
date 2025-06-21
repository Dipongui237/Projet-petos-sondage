import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
type ProtectedRouteProps = {
  children: React.ReactNode;
};
export default function ProtectedRoute({
  children
}: ProtectedRouteProps) {
  const {
    isAuthenticated
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}