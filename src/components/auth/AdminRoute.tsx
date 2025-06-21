import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
type AdminRouteProps = {
  children: React.ReactNode;
};
export default function AdminRoute({
  children
}: AdminRouteProps) {
  const {
    isAuthenticated,
    isAdmin
  } = useAuth();
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}