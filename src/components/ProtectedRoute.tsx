import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';
import React from 'react';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;