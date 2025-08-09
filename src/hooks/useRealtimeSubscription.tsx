import { useEffect } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface UseRealtimeSubscriptionOptions {
  table: string;
  event?: string;
  filter?: string;
  schema?: string;
  onPayload?: (payload: RealtimePostgresChangesPayload<{[key: string]: any}>) => void;
  enabled?: boolean;
}

export const useRealtimeSubscription = (options: UseRealtimeSubscriptionOptions) => {
  // Disabled for now to prevent crashes
  useEffect(() => {
    console.log('Realtime subscription disabled temporarily');
  }, []);

  return {
    connectionStatus: 'disconnected',
    isSubscribed: false
  };
};