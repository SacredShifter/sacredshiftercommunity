// This file is now merged. Duplicate in src/hooks can be deleted.
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuthContext';
import { toast } from 'sonner';

export interface SacredCircle {
  id: string;
  name: string;
  description?: string;
  is_private: boolean;
  chakra_focus?: string;
  frequency_range?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  is_member?: boolean;
}

export interface CircleMessage {
  id: string;
  user_id: string;
  circle_id: string;
  content: string;
  chakra_tag?: string;
  tone?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name?: string;
    avatar_url?: string;
  };
}

export interface MessageOptions {
  chakraTag?: string;
  tone?: string;
  circleId?: string;
}

export const useSacredCircles = () => {
  const { user } = useAuth();
  const [circles, setCircles] = useState<SacredCircle[]>([]);
  const [messages, setMessages] = useState<CircleMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's circles
  const fetchCircles = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching circles for user:', user.id);

      // First, check if the tables exist by trying a simple query
      const { data: testQuery, error: testError } = await supabase
        .from('circle_groups')
        .select('id')
        .limit(1);

      if (testError) {
        console.error('Circle groups table error:', testError);
        throw new Error('Circle groups table not accessible');
      }

      // Get circles the user is a member of
      const { data: memberCircles, error: memberError } = await supabase
        .from('circle_group_members')
        .select(`
          group_id,
          role,
          circle_groups!inner (
            id,
            name,
            description,
            is_private,
            chakra_focus,
            frequency_range,
            created_by,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id);

      if (memberError) {
        console.error('Member circles error:', memberError);
        // Don't throw here, just log and continue with public circles
      }

      // Get public circles for discovery
      const { data: publicCircles, error: publicError } = await supabase
        .from('circle_groups')
        .select('*')
        .eq('is_private', false)
        .limit(50);

      if (publicError) {
        console.error('Public circles error:', publicError);
        throw publicError;
      }

      console.log('Member circles:', memberCircles);
      console.log('Public circles:', publicCircles);

      // Combine and format circles
      const userCircleIds = memberCircles?.map(mc => mc.circle_groups?.id) || [];
      const formattedCircles: SacredCircle[] = [];

      // Add user's circles
      memberCircles?.forEach(mc => {
        if (mc.circle_groups) {
          formattedCircles.push({
            ...mc.circle_groups,
            is_member: true
          });
        }
      });

      // Add public circles not already in user's circles
      publicCircles?.forEach(pc => {
        if (!userCircleIds.includes(pc.id)) {
          formattedCircles.push({
            ...pc,
            is_member: false
          });
        }
      });

      console.log('Formatted circles:', formattedCircles);
      setCircles(formattedCircles);
    } catch (err) {
      console.error('Error fetching circles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch circles');
      toast.error('Failed to load Sacred Circles');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch recent messages for a specific circle
  const fetchRecentMessages = useCallback(async (circleId?: string) => {
    if (!user || !circleId) return;

    try {
      console.log('Fetching messages for circle:', circleId);

      const { data, error } = await supabase
        .from('circle_posts')
        .select(`
          id,
          user_id,
          content,
          chakra_tag,
          tone,
          created_at,
          updated_at,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq('circle_id', circleId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Messages fetch error:', error);
        throw error;
      }

      console.log('Fetched messages:', data);

      const formattedMessages: CircleMessage[] = data?.map(msg => ({
        id: msg.id,
        user_id: msg.user_id,
        circle_id: circleId,
        content: msg.content,
        chakra_tag: msg.chakra_tag,
        tone: msg.tone,
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        profiles: msg.profiles
      })) || [];

      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      toast.error('Failed to load circle messages');
    }
  }, [user]);

  // Send message to circle
  const sendMessage = useCallback(async (
    content: string,
    messageType: string = 'circle',
    options: MessageOptions = {}
  ) => {
    if (!user || !content.trim()) return false;

    try {
      console.log('Sending message:', { content, options });

      const { data, error } = await supabase
        .from('circle_posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          chakra_tag: options.chakraTag || 'heart',
          tone: options.tone || 'harmonious',
          circle_id: options.circleId
        })
        .select(`
          id,
          user_id,
          content,
          chakra_tag,
          tone,
          created_at,
          updated_at,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Send message error:', error);
        throw error;
      }

      console.log('Message sent:', data);

      // Add the new message to local state
      if (data && options.circleId) {
        const newMessage: CircleMessage = {
          id: data.id,
          user_id: data.user_id,
          circle_id: options.circleId,
          content: data.content,
          chakra_tag: data.chakra_tag,
          tone: data.tone,
          created_at: data.created_at,
          updated_at: data.updated_at,
          profiles: data.profiles
        };

        setMessages(prev => [...prev, newMessage]);
      }

      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      return false;
    }
  }, [user]);

  // Create a new circle
  const createCircle = useCallback(async (
    name: string,
    description?: string,
    isPrivate: boolean = false,
    chakraFocus?: string,
    frequencyRange?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Creating circle:', { name, description, isPrivate, chakraFocus, frequencyRange });

      const { data, error } = await supabase
        .from('circle_groups')
        .insert({
          name,
          description,
          is_private: isPrivate,
          chakra_focus: chakraFocus,
          frequency_range: frequencyRange,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Create circle error:', error);
        throw error;
      }

      console.log('Circle created:', data);

      // Automatically join the circle as admin
      const { error: memberError } = await supabase
        .from('circle_group_members')
        .insert({
          group_id: data.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) {
        console.error('Join circle error:', memberError);
        throw memberError;
      }

      // Refresh circles data
      await fetchCircles();
      return data;
    } catch (err) {
      console.error('Error creating circle:', err);
      throw new Error('Failed to create Sacred Circle');
    }
  }, [user, fetchCircles]);

  // Join a circle
  const joinCircle = useCallback(async (circleId: string) => {
    if (!user) return false;

    try {
      console.log('Joining circle:', circleId);

      const { error } = await supabase
        .from('circle_group_members')
        .insert({
          group_id: circleId,
          user_id: user.id,
          role: 'member'
        });

      if (error) {
        console.error('Join circle error:', error);
        throw error;
      }

      // Update local state
      setCircles(prev => prev.map(circle => 
        circle.id === circleId 
          ? { ...circle, is_member: true }
          : circle
      ));

      toast.success('Successfully joined the Sacred Circle');
      return true;
    } catch (err) {
      console.error('Error joining circle:', err);
      toast.error('Failed to join circle');
      return false;
    }
  }, [user]);

  // Leave a circle
  const leaveCircle = useCallback(async (circleId: string) => {
    if (!user) return false;

    try {
      console.log('Leaving circle:', circleId);

      const { error } = await supabase
        .from('circle_group_members')
        .delete()
        .eq('group_id', circleId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Leave circle error:', error);
        throw error;
      }

      // Update local state
      setCircles(prev => prev.map(circle => 
        circle.id === circleId 
          ? { ...circle, is_member: false }
          : circle
      ));

      toast.success('Left the Sacred Circle');
      return true;
    } catch (err) {
      console.error('Error leaving circle:', err);
      toast.error('Failed to leave circle');
      return false;
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('circle_posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'circle_posts'
        },
        (payload) => {
          console.log('Real-time message received:', payload);
          // Only add messages for circles the user is viewing
          const newPost = payload.new as any;
          if (newPost.circle_id) {
            fetchRecentMessages(newPost.circle_id);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchRecentMessages]);

  // Load circles on mount
  useEffect(() => {
    if (user) {
      fetchCircles();
    }
  }, [user, fetchCircles]);

  return {
    circles,
    messages,
    loading,
    error,
    fetchCircles,
    fetchRecentMessages,
    sendMessage,
    createCircle,
    joinCircle,
    leaveCircle
  };
};