import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { useAuth } from './useAuth';
import { useUnifiedMessaging } from './useUnifiedMessaging';

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
  group_id?: string | null;
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
  const { sendCircleMessage: sendUnifiedMessage, isInitialized } = useUnifiedMessaging();
  const [circles, setCircles] = useState<SacredCircle[]>([]);
  const [messages, setMessages] = useState<CircleMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all Sacred Circles
  const fetchCircles = useCallback(async () => {
    if (!user) return;

    try {
      // First fetch all circles
      const { data: circlesData, error: circlesError } = await supabase
        .from('circle_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (circlesError) throw circlesError;

      // Then fetch memberships for current user
      const { data: memberships, error: membershipError } = await supabase
        .from('circle_group_members')
        .select('group_id')
        .eq('user_id', user.id);

      if (membershipError) throw membershipError;

      // Get member counts for each circle
      const { data: allMembers, error: countError } = await supabase
        .from('circle_group_members')
        .select('group_id');

      if (countError) throw countError;

      // Calculate member counts
      const memberCounts: Record<string, number> = {};
      if (allMembers) {
        for (const member of allMembers) {
          memberCounts[member.group_id] = (memberCounts[member.group_id] || 0) + 1;
        }
      }

      // Process circles with membership and count data
      const userMemberships = new Set(memberships?.map(m => m.group_id) || []);
      
      const processedCircles = (circlesData || []).map(circle => ({
        ...circle,
        is_member: userMemberships.has(circle.id),
        member_count: memberCounts?.[circle.id] || 0
      }));

      setCircles(processedCircles);
    } catch (err) {
      console.error('Error fetching circles:', err);
      setError('Failed to load Sacred Circles');
    }
  }, [user]);

  // Fetch recent posts from all circles or a specific circle
  const fetchRecentMessages = useCallback(async (groupId?: string) => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('circle_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (groupId) {
        // Filter by specific circle
        query = query.eq('group_id', groupId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Send a message with unified messaging (mesh fallback)
  const sendMessage = useCallback(async (
    content: string,
    visibility: 'circle' | 'private' = 'circle',
    options: {
      chakraTag?: string;
      tone?: string;
      frequency?: number;
      isAnonymous?: boolean;
      circleId?: string;
    } = {}
  ) => {
    if (!user) throw new Error('User not authenticated');

    // Use unified messaging system with mesh fallback
    if (isInitialized && options.circleId) {
      try {
        await sendUnifiedMessage(options.circleId, content, {
          visibility,
          chakraTag: options.chakraTag,
          tone: options.tone,
          frequency: options.frequency,
          isAnonymous: options.isAnonymous
        }, {
          fallbackToMesh: true,
          enableRetry: true
        });
        return true; // Success via unified system
      } catch (unifiedError) {
        console.warn('🌟 Unified circle messaging failed, falling back to direct database:', unifiedError);
        // Fall through to direct database attempt
      }
    }

    // Fallback to direct database method
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
          is_anonymous: options.isAnonymous || false,
          group_id: options.circleId || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error sending circle message:', err);
      throw new Error('Failed to send message');
    }
  }, [user, sendUnifiedMessage, isInitialized]);

  const requestToJoinCircle = useCallback(async (circleId: string) => {
    const { error } = await supabase.functions.invoke('request-to-join-circle', {
      body: { circle_id: circleId }
    });
    if (error) throw new Error(error.message);
  }, []);

  const inviteToCircle = useCallback(async (circleId: string, inviteeId: string) => {
    const { error } = await supabase.functions.invoke('invite-to-circle', {
      body: { circle_id: circleId, invitee_id: inviteeId }
    });
    if (error) throw new Error(error.message);
  }, []);

  const acceptInvitation = useCallback(async (invitationId: string) => {
    const { error } = await supabase.functions.invoke('accept-invitation', {
      body: { invitation_id: invitationId }
    });
    if (error) throw new Error(error.message);
    fetchCircles(); // Refresh circles to show new membership
  }, [fetchCircles]);

  const rejectInvitation = useCallback(async (invitationId: string) => {
    const { error } = await supabase.functions.invoke('reject-invitation', {
      body: { invitation_id: invitationId }
    });
    if (error) throw new Error(error.message);
  }, []);

  // Join a Sacred Circle
  const joinCircle = useCallback(async (circleId: string) => {
    if (!user) throw new Error('User not authenticated');

    const circle = circles.find(c => c.id === circleId);
    if (!circle) throw new Error('Circle not found');

    if (circle.is_private) {
      await requestToJoinCircle(circleId);
    } else {
      try {
        const { error } = await supabase
          .from('circle_group_members')
          .insert({
            group_id: circleId,
            user_id: user.id,
            role: 'member'
          });

        if (error && error.code === '23505') {
          console.log('User is already a member of this circle');
          return;
        }

        if (error) throw error;

        fetchCircles();
      } catch (err) {
        console.error('Error joining circle:', err);
        throw new Error('Failed to join Sacred Circle');
      }
    }
  }, [user, circles, fetchCircles, requestToJoinCircle]);

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
    createCircle,
    requestToJoinCircle,
    inviteToCircle,
    acceptInvitation,
    rejectInvitation
  };
};