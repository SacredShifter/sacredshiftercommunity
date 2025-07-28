import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    // Create unique channel name
    const channelName = `realtime-${table}-${Date.now()}`;
    
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
      onPayload?.(payload);
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
  }, [table, event, filter, schema, onPayload]);

  return channelRef.current;
};