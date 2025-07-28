import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { useAuth } from './useAuth';

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
  cover_url?: string;
  member_count?: number;
  is_member?: boolean;
}

export interface CircleMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  visibility?: string;
  chakra_tag?: string;
  tone?: string;
  frequency?: number;
  is_anonymous?: boolean;
  shared_with?: string[];
  has_audio?: boolean;
  has_image?: boolean;
  audio_url?: string;
  image_url?: string;
  author?: {
    id: string;
    display_name?: string;
    avatar_url?: string;
  };
  comment_count?: number;
  like_count?: number;
  user_has_liked?: boolean;
}

export const useSacredCircles = () => {
  const { user } = useAuth();
  const [circles, setCircles] = useState<SacredCircle[]>([]);
  const [messages, setMessages] = useState<CircleMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all Sacred Circles
  const fetchCircles = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('circle_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCircles(data || []);
    } catch (err) {
      console.error('Error fetching circles:', err);
      setError('Failed to load Sacred Circles');
    }
  }, [user]);

  // Fetch recent posts from all circles
  const fetchRecentMessages = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('circle_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Send a message (general post, not tied to specific circle yet)
  const sendMessage = useCallback(async (
    content: string,
    visibility: 'circle' | 'private' = 'circle',
    options: {
      chakraTag?: string;
      tone?: string;
      frequency?: number;
      isAnonymous?: boolean;
    } = {}
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('circle_posts')
        .insert({
          user_id: user.id,
          content,
          visibility,
          chakra_tag: options.chakraTag,
          tone: options.tone,
          frequency: options.frequency,
          is_anonymous: options.isAnonymous || false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      throw new Error('Failed to send message');
    }
  }, [user]);

  // Join a Sacred Circle
  const joinCircle = useCallback(async (circleId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('circle_group_members')
        .insert({
          group_id: circleId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;
      
      // Refresh circles data
      fetchCircles();
    } catch (err) {
      console.error('Error joining circle:', err);
      throw new Error('Failed to join Sacred Circle');
    }
  }, [user, fetchCircles]);

  // Leave a Sacred Circle
  const leaveCircle = useCallback(async (circleId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('circle_group_members')
        .delete()
        .eq('group_id', circleId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Refresh circles data
      fetchCircles();
    } catch (err) {
      console.error('Error leaving circle:', err);
      throw new Error('Failed to leave Sacred Circle');
    }
  }, [user, fetchCircles]);

  // Create a new Sacred Circle
  const createCircle = useCallback(async (
    name: string,
    description?: string,
    isPrivate: boolean = false,
    chakraFocus?: string,
    frequencyRange?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
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

      if (error) throw error;

      // Automatically join the circle as admin
      await supabase
        .from('circle_group_members')
        .insert({
          group_id: data.id,
          user_id: user.id,
          role: 'admin'
        });

      // Refresh circles data
      fetchCircles();
      return data;
    } catch (err) {
      console.error('Error creating circle:', err);
      throw new Error('Failed to create Sacred Circle');
    }
  }, [user, fetchCircles]);

  // Set up real-time subscription for circle posts
  useRealtimeSubscription({
    table: 'circle_posts',
    onPayload: (payload) => {
      if (payload.eventType === 'INSERT') {
        const newMessage = payload.new as CircleMessage;
        setMessages(prev => [newMessage, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        const updatedMessage = payload.new as CircleMessage;
        setMessages(prev =>
          prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
        );
      } else if (payload.eventType === 'DELETE') {
        const deletedMessage = payload.old as CircleMessage;
        setMessages(prev => prev.filter(msg => msg.id !== deletedMessage.id));
      }
    }
  });

  // Set up real-time subscription for circle groups
  useRealtimeSubscription({
    table: 'circle_groups',
    onPayload: (payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        fetchCircles();
      }
    }
  });

  // Set up real-time subscription for group members
  useRealtimeSubscription({
    table: 'circle_group_members',
    onPayload: (payload) => {
      // Refresh circles when membership changes
      fetchCircles();
    }
  });

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchCircles();
      fetchRecentMessages();
    }
  }, [user, fetchCircles, fetchRecentMessages]);

  return {
    circles,
    messages,
    loading,
    error,
    fetchCircles,
    fetchRecentMessages,
    sendMessage,
    joinCircle,
    leaveCircle,
    createCircle
  };
};