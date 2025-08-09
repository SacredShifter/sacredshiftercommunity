import React, { useEffect } from 'react';
import { RegistryList } from '@/components/RegistryOfResonance/RegistryList';
import { useAuth } from '@/hooks/useAuthContext';

export default function Registry() {
  const { user, loading } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log('Registry page mounted');
    console.log('Auth state:', { user, loading });
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-6">
          You need to be logged in to access the Resonance Register.
        </p>
      </div>
    );
  }

  return <RegistryList />;
}