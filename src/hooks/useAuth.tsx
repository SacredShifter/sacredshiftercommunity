import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useErrorHandler } from './useErrorHandler';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole?: string;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>();
  const { handleAuthError } = useErrorHandler();
  
  logger.debug('AuthProvider state change', { 
    component: 'AuthProvider',
    userId: user?.id,
    metadata: { hasSession: !!session, loading }
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logger.authEvent(`Auth state changed: ${event}`, {
          component: 'AuthProvider',
          function: 'onAuthStateChange',
          userId: session?.user?.id,
          metadata: { event, hasSession: !!session }
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role if logged in
        if (session?.user) {
          // Set loading to false immediately and fetch roles in background
          setLoading(false);
          
          // Fetch roles in background with timeout
          setTimeout(async () => {
            try {
              const { data: roles, error } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id);
              
              if (error) {
                handleAuthError(error, {
                  component: 'AuthProvider',
                  function: 'fetchUserRoles',
                  userId: session.user.id
                });
                setUserRole('user'); // Default to user role on error
              } else {
                // Check if user is admin
                const isAdmin = roles?.some(r => r.role === 'admin');
                setUserRole(isAdmin ? 'admin' : 'user');
                
                logger.debug('User roles fetched successfully', {
                  component: 'AuthProvider',
                  userId: session.user.id,
                  metadata: { isAdmin, roleCount: roles?.length }
                });
              }
            } catch (error) {
              handleAuthError(error, {
                component: 'AuthProvider',
                function: 'fetchUserRoles',
                userId: session.user.id
              });
              setUserRole('user'); // Default to user role on error
            }
          }, 0);
        } else {
          setUserRole(undefined);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        logger.authEvent('Auth session error', {
          component: 'AuthProvider',
          function: 'getSession',
          userId: undefined,
          metadata: { error: String((error as any)?.message || error) }
        });
        try { await supabase.auth.signOut(); } catch {}
        setSession(null);
        setUser(null);
        setUserRole(undefined);
        setLoading(false);
        return;
      }
      logger.debug('Initial session check completed', {
        component: 'AuthProvider',
        function: 'getSession',
        userId: session?.user?.id,
        metadata: { hasSession: !!session }
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Set loading to false immediately for initial session
      setLoading(false);
      
      // Fetch user role if logged in (in background)
      if (session?.user) {
        setTimeout(async () => {
          try {
            const { data: roles, error } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id);
            
            if (error) {
              handleAuthError(error, {
                component: 'AuthProvider',
                function: 'fetchInitialUserRoles',
                userId: session.user.id
              });
              setUserRole('user'); // Default to user role on error
            } else {
              const isAdmin = roles?.some(r => r.role === 'admin');
              setUserRole(isAdmin ? 'admin' : 'user');
            }
          } catch (error) {
            handleAuthError(error, {
              component: 'AuthProvider',
              function: 'fetchInitialUserRoles',
              userId: session?.user?.id
            });
            setUserRole('user'); // Default to user role on error
          }
        }, 0);
      } else {
        setUserRole(undefined);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};