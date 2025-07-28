import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { useAuth } from './useAuth';

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  message_type: 'text' | 'image' | 'audio' | 'file';
  metadata: any;
  reply_to_id?: string;
  sender?: {
    id: string;
    display_name?: string;
    avatar_url?: string;
  };
  recipient?: {
    id: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message_id?: string;
  last_message_at: string;
  created_at: string;
  other_participant?: {
    id: string;
    display_name?: string;
    avatar_url?: string;
  };
  last_message?: DirectMessage;
}

export const useDirectMessages = (conversationUserId?: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages for specific conversation
  const fetchMessages = useCallback(async (otherUserId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:profiles!sender_id(id, display_name, avatar_url),
          recipient:profiles!recipient_id(id, display_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch all conversations for current user
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          last_message:direct_messages!last_message_id(*),
          participant_1:profiles!participant_1_id(id, display_name, avatar_url),
          participant_2:profiles!participant_2_id(id, display_name, avatar_url)
        `)
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Transform conversations to include other participant info
      const transformedConversations = (data || []).map(conv => ({
        ...conv,
        other_participant: conv.participant_1_id === user.id 
          ? conv.participant_2 
          : conv.participant_1
      }));

      setConversations(transformedConversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    }
  }, [user]);

  // Send a new message
  const sendMessage = useCallback(async (
    recipientId: string, 
    content: string, 
    messageType: 'text' | 'image' | 'audio' | 'file' = 'text',
    metadata: any = {},
    replyToId?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content,
          message_type: messageType,
          metadata,
          reply_to_id: replyToId
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

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds: string[]) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('direct_messages')
        .update({ is_read: true })
        .in('id', messageIds)
        .eq('recipient_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [user]);

  // Set up real-time subscription for direct messages
  useRealtimeSubscription({
    table: 'direct_messages',
    onPayload: (payload) => {
      if (payload.eventType === 'INSERT') {
        const newMessage = payload.new as DirectMessage;
        
        // Only add message if it's for current conversation
        if (conversationUserId && 
           ((newMessage.sender_id === user?.id && newMessage.recipient_id === conversationUserId) ||
            (newMessage.sender_id === conversationUserId && newMessage.recipient_id === user?.id))) {
          setMessages(prev => [...prev, newMessage]);
        }
        
        // Refresh conversations list
        fetchConversations();
      } else if (payload.eventType === 'UPDATE') {
        const updatedMessage = payload.new as DirectMessage;
        setMessages(prev => 
          prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
        );
      }
    }
  });

  // Set up real-time subscription for conversations
  useRealtimeSubscription({
    table: 'conversations',
    onPayload: (payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        fetchConversations();
      }
    }
  });

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchConversations();
      if (conversationUserId) {
        fetchMessages(conversationUserId);
      }
    }
  }, [user, conversationUserId, fetchConversations, fetchMessages]);

  return {
    messages,
    conversations,
    loading,
    error,
    sendMessage,
    markAsRead,
    fetchMessages,
    fetchConversations
  };
};