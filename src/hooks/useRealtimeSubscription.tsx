import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeSubscriptionOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  schema?: string;
  onPayload?: (payload: any) => void;
}

export const useRealtimeSubscription = ({
  table,
  event = '*',
  filter,
  schema = 'public',
  onPayload
}: UseRealtimeSubscriptionOptions) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const payloadHandlerRef = useRef(onPayload);

  // Update the handler ref when onPayload changes
  useEffect(() => {
    payloadHandlerRef.current = onPayload;
  }, [onPayload]);

  // Stable callback that uses the ref
  const stableOnPayload = useCallback((payload: any) => {
    payloadHandlerRef.current?.(payload);
  }, []);

  useEffect(() => {
    // Create unique channel name
    const channelName = `realtime-${table}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`Setting up realtime subscription for ${table}`, {
      event,
      filter,
      schema
    });

    // Create channel
    const channel = supabase.channel(channelName);

    // Set up postgres changes listener
    const config: any = {
      event,
      schema,
      table
    };

    if (filter) {
      config.filter = filter;
    }

    channel.on('postgres_changes', config, (payload) => {
      console.log(`Realtime update for ${table}:`, payload);
      stableOnPayload(payload);
    });

    // Subscribe to channel
    channel.subscribe((status) => {
      console.log(`Realtime subscription status for ${table}:`, status);
    });

    channelRef.current = channel;

    // Cleanup function
    return () => {
      console.log(`Cleaning up realtime subscription for ${table}`);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, event, filter, schema, stableOnPayload]);

  return channelRef.current;
};