import {
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { supabase } from '../integrations/supabase/client';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { AuthContext } from './useAuthContext';

interface UserProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Immediately try to get the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};