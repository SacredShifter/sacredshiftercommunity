import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { useAuth } from './useAuth';
import { useMessageValidation } from './useMessageValidation';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type DirectMessageRow = Database['public']['Tables']['direct_messages']['Row'];
type ConversationRow = Database['public']['Tables']['conversations']['Row'];

export interface DirectMessage extends DirectMessageRow {
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

export interface Conversation extends ConversationRow {
  other_participant?: {
    id: string;
    display_name?: string;
    avatar_url?: string;
  };
  last_message?: DirectMessage;
}

export const useDirectMessages = (conversationUserId?: string) => {
  const { user } = useAuth();
  const { validateAndSend } = useMessageValidation();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<{ [userId: string]: boolean }>({});

  // Fetch messages for specific conversation
  const fetchMessages = useCallback(async (otherUserId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Fetching messages between', user.id, 'and', otherUserId);
      
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      
      console.log('Fetched messages:', data);
      setMessages((data || []) as DirectMessage[]);
      setError(null); // Clear any previous errors
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
      setLoading(true);
      console.log('Fetching conversations for user:', user.id);
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }

      console.log('Fetched conversations:', data);

      // Transform conversations to basic format
      const transformedConversations = (data || []).map(conv => ({
        ...conv,
        other_participant: undefined, // Will be populated later when needed
        last_message: undefined // Will be populated later when needed
      }));

      setConversations(transformedConversations as Conversation[]);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false); // This was missing!
    }
  }, [user]);

  // Send a new message with validation
  const sendMessage = useCallback(async (
    recipientId: string, 
    content: string, 
    messageType: 'text' | 'image' | 'audio' | 'file' = 'text',
    metadata: any = {},
    replyToId?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    const success = await validateAndSend(
      content,
      messageType,
      user.id,
      async () => {
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
      }
    );

    if (!success) {
      throw new Error('Message validation failed');
    }

    return success;
  }, [user, validateAndSend]);

  // Typing indicator functions
  const setTypingStatus = useCallback((recipientId: string, typing: boolean) => {
    if (!user) return;
    
    setIsTyping(prev => ({ ...prev, [recipientId]: typing }));
    
    // In a real implementation, you'd send this to the recipient via websocket
    // For now, we'll just manage local state
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
    }
  }, [user, fetchConversations]);

  // Separate effect for fetching messages when conversation changes
  useEffect(() => {
    if (user && conversationUserId) {
      fetchMessages(conversationUserId);
    }
  }, [user, conversationUserId, fetchMessages]);

  return {
    messages,
    conversations,
    loading,
    error,
    sendMessage,
    markAsRead,
    fetchMessages,
    fetchConversations,
    isTyping,
    setTypingStatus
  };
};