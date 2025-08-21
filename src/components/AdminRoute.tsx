import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading, userRole, roleLoading } = useAuth();
  
  // Add detailed logging for debugging
  console.log('AdminRoute Debug:', {
    user: user?.id,
    loading,
    userRole,
    roleLoading,
    hasUser: !!user,
    timestamp: new Date().toISOString()
  });
  
  logger.debug('AdminRoute state check', {
    component: 'AdminRoute',
    userId: user?.id,
    metadata: { loading, userRole, roleLoading, hasUser: !!user }
  });

  // Show loading if auth is loading OR role is still being fetched
  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Explicitly check for admin role - reject if undefined, null, or not 'admin'
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p className="text-muted-foreground mb-4">
            This area is reserved for administrators only.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;