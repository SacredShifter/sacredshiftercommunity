import { supabase } from '@/integrations/supabase/client';

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: string;
  metadata?: Record<string, unknown>;
  reply_to_id?: string;
  priority?: string;
  is_read: boolean;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DirectMessageWithProfiles extends DirectMessage {
  sender: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  recipient: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface ConversationWithProfiles {
  participant_1_id: string;
  participant_2_id: string;
  participant_1_display_name: string | null;
  participant_1_avatar_url: string | null;
  participant_2_display_name: string | null;
  participant_2_avatar_url: string | null;
  last_message_content: string | null;
  last_message_created_at: string | null;
  unread_count: number;
}

export interface MessageOptions {
  messageType?: string;
  metadata?: Record<string, unknown>;
  replyToId?: string;
  priority?: string;
}

class DirectMessagesService {
  // Test if banned_users table exists and create it if not
  async testBannedUsersTable() {
    try {
      const { data, error } = await supabase.rpc('test_banned_users_table');
      if (error) {
        console.error('Error testing banned_users table:', error);
        return { success: false, error };
      }
      return { success: true, data };
    } catch (error) {
      console.error('Error in testBannedUsersTable:', error);
      return { success: false, error };
    }
  }

  // Debug version of sendMessage with more detailed error reporting
  async sendMessageWithDebug(
    senderId: string,
    recipientId: string,
    content: string,
    options: MessageOptions = {}
  ) {
    try {
      console.log('Sending message with debug:', { senderId, recipientId, content, options });
      
      // Check if sender is banned
      const { data: isSenderBanned, error: senderBanError } = await supabase.rpc('is_user_banned', {
        check_user_id: senderId
      });
      
      if (senderBanError) {
        console.error('Error checking if sender is banned:', senderBanError);
        return { data: null, error: { message: 'Error checking sender ban status: ' + senderBanError.message } };
      }
      
      if (isSenderBanned) {
        return { data: null, error: { message: 'You are banned from sending messages' } };
      }
      
      // Check if recipient is banned
      const { data: isRecipientBanned, error: recipientBanError } = await supabase.rpc('is_user_banned', {
        check_user_id: recipientId
      });
      
      if (recipientBanError) {
        console.error('Error checking if recipient is banned:', recipientBanError);
        return { data: null, error: { message: 'Error checking recipient ban status: ' + recipientBanError.message } };
      }
      
      if (isRecipientBanned) {
        return { data: null, error: { message: 'This user is banned and cannot receive messages' } };
      }
      
      // Prepare message data
      const messageData = {
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        message_type: options.messageType || 'text',
        metadata: options.metadata || {},
        reply_to_id: options.replyToId || null,
        priority: options.priority || 'normal',
        is_read: false
      };
      
      console.log('Message data prepared:', messageData);
      
      // Insert message
      const { data, error } = await supabase
        .from('direct_messages')
        .insert([messageData])
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting message:', error);
        return { data: null, error: { message: 'Failed to send message: ' + error.message } };
      }
      
      console.log('Message sent successfully:', data);
      
      // Get sender profile
      const { data: senderProfile, error: senderProfileError } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('user_id', senderId)
        .single();
      
      if (senderProfileError) {
        console.error('Error fetching sender profile:', senderProfileError);
      }
      
      // Get recipient profile
      const { data: recipientProfile, error: recipientProfileError } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('user_id', recipientId)
        .single();
      
      if (recipientProfileError) {
        console.error('Error fetching recipient profile:', recipientProfileError);
      }
      
      // Attach profiles to message
      const messageWithProfiles = {
        ...data,
        sender: senderProfile || null,
        recipient: recipientProfile || null
      };
      
      return { data: messageWithProfiles, error: null };
    } catch (error) {
      console.error('Error in sendMessageWithDebug:', error);
      return { data: null, error: { message: 'Unexpected error: ' + (error instanceof Error ? error.message : String(error)) } };
    }
  }

  // Get conversations with profile information using manual joins
  async getConversationsWithProfiles(userId: string) {
    try {
      // Get all conversations for the user
      const { data: conversations, error: conversationsError } = await supabase
        .from('direct_messages')
        .select(`
          sender_id,
          recipient_id,
          content,
          created_at,
          is_read
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (conversationsError) {
        throw conversationsError;
      }

      if (!conversations || conversations.length === 0) {
        return { data: [], error: null };
      }

      // Get unique participant IDs
      const participantIds = new Set<string>();
      conversations.forEach(msg => {
        if (msg.sender_id !== userId) participantIds.add(msg.sender_id);
        if (msg.recipient_id !== userId) participantIds.add(msg.recipient_id);
      });

      // Fetch profile data for all participants - FIXED: using 'id' instead of 'user_id'
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, avatar_url')
        .in('user_id', Array.from(participantIds));

      if (profilesError) {
        throw profilesError;
      }

      // Create profile lookup map
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

      // Group messages by conversation and get latest message
      const conversationMap = new Map<string, any>();
      
      conversations.forEach(msg => {
        const otherParticipantId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
        const conversationKey = [userId, otherParticipantId].sort().join('-');
        
        if (!conversationMap.has(conversationKey)) {
          const otherProfile = profileMap.get(otherParticipantId);
          conversationMap.set(conversationKey, {
            participant_1_id: userId,
            participant_2_id: otherParticipantId,
            participant_1_display_name: null, // Current user
            participant_1_avatar_url: null,
            participant_2_display_name: otherProfile?.display_name || null,
            participant_2_avatar_url: otherProfile?.avatar_url || null,
            last_message_content: msg.content,
            last_message_created_at: msg.created_at,
            unread_count: 0
          });
        }

        // Count unread messages (messages sent to current user that are unread)
        if (msg.recipient_id === userId && !msg.is_read) {
          const conversation = conversationMap.get(conversationKey);
          conversation.unread_count++;
        }
      });

      const result = Array.from(conversationMap.values());
      return { data: result, error: null };

    } catch (error) {
      console.error('Error fetching conversations:', error);
      return { data: null, error };
    }
  }

  // Get messages between two users with profile information
  async getMessagesWithProfiles(userId: string, otherUserId: string) {
    try {
      // Get messages between the two users
      const { data: messages, error: messagesError } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (messagesError) {
        throw messagesError;
      }

      if (!messages || messages.length === 0) {
        return { data: [], error: null };
      }

      // Get profile data for both users - FIXED: using 'user_id' instead of 'id'
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', [userId, otherUserId]);

      if (profilesError) {
        throw profilesError;
      }

      // Create profile lookup map
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

      // Attach profile data to messages
      const messagesWithProfiles = messages.map(msg => ({
        ...msg,
        sender: profileMap.get(msg.sender_id) || null,
        recipient: profileMap.get(msg.recipient_id) || null
      }));

      return { data: messagesWithProfiles, error: null };

    } catch (error) {
      console.error('Error fetching messages with profiles:', error);
      return { data: null, error };
    }
  }

  // Send a message
  async sendMessage(
    senderId: string,
    recipientId: string,
    content: string,
    options: MessageOptions = {}
  ) {
    try {
      const messageData = {
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        message_type: options.messageType || 'text',
        metadata: options.metadata || {},
        reply_to_id: options.replyToId || null,
        priority: options.priority || 'normal',
        is_read: false
      };

      const { data, error } = await supabase
        .from('direct_messages')
        .insert([messageData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };

    } catch (error) {
      console.error('Error sending message:', error);
      return { data: null, error };
    }
  }

  // Get unread message count for a user
  async getUnreadMessageCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('direct_messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', userId)
        .eq('is_read', false)
        .is('deleted_at', null);

      if (error) {
        throw error;
      }

      return { count: count || 0, error: null };

    } catch (error) {
      console.error('Error getting unread message count:', error);
      return { count: 0, error };
    }
  }

  // Mark messages as read
  async markMessagesAsRead(userId: string, otherUserId: string) {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .update({ is_read: true })
        .eq('recipient_id', userId)
        .eq('sender_id', otherUserId)
        .eq('is_read', false);

      if (error) {
        throw error;
      }

      return { error: null };

    } catch (error) {
      console.error('Error marking messages as read:', error);
      return { error };
    }
  }

  // Search messages
  async searchMessages(userId: string, query: string, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .textSearch('content', query)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return { data: data || [], error: null };

    } catch (error) {
      console.error('Error searching messages:', error);
      return { data: null, error };
    }
  }

  // Delete a message
  async deleteMessage(messageId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('sender_id', userId);

      if (error) {
        throw error;
      }

      return { error: null };

    } catch (error) {
      console.error('Error deleting message:', error);
      return { error };
    }
  }

  // Block/unblock user functionality
  async blockUser(userId: string, blockedUserId: string) {
    try {
      const { error } = await supabase
        .from('user_blocks')
        .insert([{
          user_id: userId,
          blocked_user_id: blockedUserId
        }]);

      if (error) {
        throw error;
      }

      return { error: null };

    } catch (error) {
      console.error('Error blocking user:', error);
      return { error };
    }
  }

  async unblockUser(userId: string, blockedUserId: string) {
    try {
      const { error } = await supabase
        .from('user_blocks')
        .delete()
        .eq('user_id', userId)
        .eq('blocked_user_id', blockedUserId);

      if (error) {
        throw error;
      }

      return { error: null };

    } catch (error) {
      console.error('Error unblocking user:', error);
      return { error };
    }
  }

  async getBlockedUsers(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_blocks')
        .select('blocked_user_id')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return { data: data?.map(block => block.blocked_user_id) || [], error: null };

    } catch (error) {
      console.error('Error getting blocked users:', error);
      return { data: null, error };
    }
  }
}

export const directMessagesService = new DirectMessagesService();