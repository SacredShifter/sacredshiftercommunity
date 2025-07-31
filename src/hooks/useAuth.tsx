import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
  
  console.log('AuthProvider state:', { user, session, loading });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', { event, session, user: session?.user });
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
                console.error('Error fetching user roles:', error);
                setUserRole('user'); // Default to user role on error
              } else {
                // Check if user is admin
                const isAdmin = roles?.some(r => r.role === 'admin');
                setUserRole(isAdmin ? 'admin' : 'user');
              }
            } catch (error) {
              console.error('Error in role fetch:', error);
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
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', { session, user: session?.user });
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
              console.error('Error fetching user roles:', error);
              setUserRole('user'); // Default to user role on error
            } else {
              // Check if user is admin
              const isAdmin = roles?.some(r => r.role === 'admin');
              setUserRole(isAdmin ? 'admin' : 'user');
            }
          } catch (error) {
            console.error('Error in role fetch:', error);
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