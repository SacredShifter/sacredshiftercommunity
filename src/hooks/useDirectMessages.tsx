// This file is now merged. Duplicate in src/hooks can be deleted.
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { directMessagesService, DirectMessageWithProfiles, ConversationWithProfiles } from '@/lib/directMessagesService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MessageOptions {
  messageType?: string;
  metadata?: Record<string, unknown>;
  replyToId?: string;
  priority?: string;
}

export interface ScheduleMessageOptions {
  messageType?: string;
  metadata?: Record<string, unknown>;
}

export const useDirectMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DirectMessageWithProfiles[]>([]);
  const [conversations, setConversations] = useState<ConversationWithProfiles[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch conversations with enhanced service
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await directMessagesService.getConversationsWithProfiles(user.id);

      if (fetchError) {
        console.error('Error fetching conversations:', fetchError);
        setError('Failed to load conversations');
        return;
      }

      if (data) {
        setConversations(data);
      }
    } catch (err) {
      console.error('Error in fetchConversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (otherUserId: string) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await directMessagesService.getMessagesWithProfiles(
        user.id, 
        otherUserId
      );

      if (fetchError) {
        console.error('Error fetching messages:', fetchError);
        setError('Failed to load messages');
        return { data: null, error: fetchError };
      }

      setMessages(data || []);
      return { data, error: null };
    } catch (err) {
      console.error('Error in fetchMessages:', err);
      const errorMessage = 'Failed to load messages';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Send a message
  const sendMessage = useCallback(async (
    recipientId: string, 
    content: string, 
    messageType: string = 'text',
    options: MessageOptions = {},
    metadata?: Record<string, unknown>
  ) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      const messageOptions = {
        ...options,
        messageType,
        metadata: metadata || options.metadata
      };

      const { data, error } = await directMessagesService.sendMessage(
        user.id,
        recipientId,
        content,
        messageOptions
      );

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return { data: null, error };
      }

      if (data) {
        // Update local messages if this is the current conversation
        setMessages(prev => {
          const isCurrentConversation = prev.some(msg => 
            (msg.sender_id === user.id && msg.recipient_id === recipientId) ||
            (msg.sender_id === recipientId && msg.recipient_id === user.id)
          );
          
          if (isCurrentConversation) {
            return [...prev, data];
          }
          return prev;
        });

        // Refresh conversations to update order
        fetchConversations();
        
        toast.success('Message sent!');
      }

      return { data, error: null };
    } catch (err) {
      console.error('Error in sendMessage:', err);
      const errorMessage = 'Failed to send message';
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }, [user, fetchConversations]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (otherUserId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await directMessagesService.markMessagesAsRead(user.id, otherUserId);
      
      if (error) {
        console.error('Error marking messages as read:', error);
        return { error };
      }

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.recipient_id === user.id && msg.sender_id === otherUserId
          ? { ...msg, is_read: true }
          : msg
      ));

      // Refresh unread count
      fetchUnreadCount();

      return { error: null };
    } catch (err) {
      console.error('Error in markMessagesAsRead:', err);
      return { error: 'Failed to mark messages as read' };
    }
  }, [user]);

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await directMessagesService.deleteMessage(messageId, user.id);
      
      if (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
        return { error };
      }

      // Update local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message deleted');

      return { error: null };
    } catch (err) {
      console.error('Error in deleteMessage:', err);
      const errorMessage = 'Failed to delete message';
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  }, [user]);

  // Fetch unread count with proper error handling
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const { count, error } = await directMessagesService.getUnreadMessageCount(user.id);
      
      if (error) {
        console.error('Error fetching unread count:', error);
        return;
      }

      setUnreadCount(count || 0);
    } catch (err) {
      console.error('Error in fetchUnreadCount:', err);
    }
  }, [user]);

  // Search messages
  const searchMessages = useCallback(async (query: string, limit = 50) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      const { data, error } = await directMessagesService.searchMessages(user.id, query, limit);
      
      if (error) {
        console.error('Error searching messages:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Error in searchMessages:', err);
      return { data: null, error: 'Failed to search messages' };
    }
  }, [user]);

  // Block/unblock user
  const blockUser = useCallback(async (blockedUserId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await directMessagesService.blockUser(user.id, blockedUserId);
      
      if (error) {
        console.error('Error blocking user:', error);
        toast.error('Failed to block user');
        return { error };
      }

      toast.success('User blocked');
      return { error: null };
    } catch (err) {
      console.error('Error in blockUser:', err);
      const errorMessage = 'Failed to block user';
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  }, [user]);

  const unblockUser = useCallback(async (blockedUserId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await directMessagesService.unblockUser(user.id, blockedUserId);
      
      if (error) {
        console.error('Error unblocking user:', error);
        toast.error('Failed to unblock user');
        return { error };
      }

      toast.success('User unblocked');
      return { error: null };
    } catch (err) {
      console.error('Error in unblockUser:', err);
      const errorMessage = 'Failed to unblock user';
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  }, [user]);

  // Get blocked users
  const getBlockedUsers = useCallback(async () => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      const { data, error } = await directMessagesService.getBlockedUsers(user.id);
      
      if (error) {
        console.error('Error getting blocked users:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Error in getBlockedUsers:', err);
      return { data: null, error: 'Failed to get blocked users' };
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('direct_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Refresh conversations and unread count
            fetchConversations();
            fetchUnreadCount();
          } else if (payload.eventType === 'UPDATE') {
            // Handle message updates (like read status)
            fetchUnreadCount();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConversations, fetchUnreadCount]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchUnreadCount();
    }
  }, [user, fetchConversations, fetchUnreadCount]);

  return {
    messages,
    conversations,
    loading,
    error,
    unreadCount,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markMessagesAsRead,
    deleteMessage,
    fetchUnreadCount,
    searchMessages,
    blockUser,
    unblockUser,
    getBlockedUsers
  };
};