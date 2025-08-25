import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useUnreadDms = () => {
  const { user } = useAuth();

  const fetchUnreadDms = async () => {
    if (!user) return [];

    const { data, error } = await supabase.rpc('get_unread_dm_counts');

    if (error) {
      console.error('Error fetching unread DM counts:', error);
      throw new Error(error.message);
    }

    return data;
  };

  return useQuery({
    queryKey: ['unreadDms', user?.id],
    queryFn: fetchUnreadDms,
    enabled: !!user,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};
