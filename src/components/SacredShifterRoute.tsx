import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

interface SacredShifterRouteProps {
  children: React.ReactNode;
}

const SACRED_SHIFTER_EMAIL = 'kentburchard@sacredshifter.com';

const SacredShifterRoute = ({ children }: SacredShifterRouteProps) => {
  const { user, loading } = useAuth();
  
  logger.debug('SacredShifterRoute access attempt', {
    component: 'SacredShifterRoute',
    userId: user?.id,
    metadata: { 
      email: user?.email,
      authorized: user?.email === SACRED_SHIFTER_EMAIL,
      timestamp: new Date().toISOString()
    }
  });

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic">
        <div className="sacred-spinner">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary shadow-glow-primary"></div>
          <div className="mt-4 text-center">
            <p className="text-primary font-sacred">Verifying Sacred Access...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Only allow access to kentburchard@sacredshifter.com
  if (user.email !== SACRED_SHIFTER_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic">
        <div className="text-center max-w-md mx-auto p-8 bg-card/20 backdrop-blur-md rounded-2xl border border-primary/20 shadow-glow-subtle">
          <div className="sacred-symbol mb-6 text-6xl text-primary animate-pulse">⧬</div>
          <h1 className="text-2xl font-bold font-sacred mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Sacred Frequency Protected
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            This neural command center resonates only with the Sacred Shifter consciousness field. 
            Your frequency signature does not match the required harmonic pattern.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => window.history.back()}
              className="sacred-button bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all duration-300"
            >
              Return to Previous Frequency
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Enter Sacred Grove
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SacredShifterRoute;