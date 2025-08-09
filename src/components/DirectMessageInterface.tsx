import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuthContext';
import { ConversationWithProfiles } from '@/hooks/useDirectMessages';
import { directMessagesService, DirectMessageWithProfiles } from '@/lib/directMessagesService';
import { 
  Send, 
  ArrowLeft, 
  Smile
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DirectMessageInterfaceProps {
  conversation: ConversationWithProfiles;
  onBack: () => void;
  className?: string;
}

export const DirectMessageInterface: React.FC<DirectMessageInterfaceProps> = ({
  conversation,
  onBack,
  className
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DirectMessageWithProfiles[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine the other participant
  const otherParticipantId = conversation.participant_1_id === user?.id 
    ? conversation.participant_2_id 
    : conversation.participant_1_id;
  
  const otherParticipantName = conversation.participant_1_id === user?.id
    ? conversation.participant_2_display_name
    : conversation.participant_1_display_name;

  const otherParticipantAvatar = conversation.participant_1_id === user?.id
    ? (typeof conversation.participant_2_avatar_url === 'string' ? conversation.participant_2_avatar_url : '')
    : (typeof conversation.participant_1_avatar_url === 'string' ? conversation.participant_1_avatar_url : '');

  // Helper: get initials from name
  const getInitials = (name?: string) => {
    if (!name) return 'SS';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Helper: format time
  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Load messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !otherParticipantId) return;
      
      try {
        setLoading(true);
        const { data, error } = await directMessagesService.getMessagesWithProfiles(
          user.id,
          otherParticipantId
        );
        
        if (error) {
          console.error('Error fetching messages:', error);
          toast.error('Failed to load messages');
          return;
        }
        
        if (data) {
          setMessages(data);
        }
      } catch (err) {
        console.error('Error in fetchMessages:', err);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [user, otherParticipantId]);

  // Handler: send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !otherParticipantId || sending) return;
    try {
      setSending(true);
      
      // First ensure the banned_users table exists
      await directMessagesService.testBannedUsersTable();
      
      // Use the debug version of sendMessage for better error reporting
      const { data, error } = await directMessagesService.sendMessageWithDebug(
        user.id,
        otherParticipantId,
        newMessage.trim(),
        { messageType: 'text' }
      );
      
      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message: ' + error.message);
        return;
      }
      
      if (data) {
        setMessages(prev => [...prev, data]);
        toast.success('Message sent!');
      } else {
        toast.error('Failed to send message: No data returned');
      }
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setSending(false);
    }
  };

  // Handler: key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Debug: log messages
  useEffect(() => {
    console.log('[DirectMessageInterface] messages state:', messages);
    if (messages.length > 0) {
      messages.forEach((msg, idx) => {
        console.log(`[Message ${idx}]`, msg);
      });
    }
  }, [messages]);

  // If this is a new conversation (no ID), show a different UI
  if (!conversation.id) {
    return (
      <div className={cn("flex flex-col h-full min-h-screen bg-background", className)} style={{width:'100%', maxWidth:'600px', margin:'0 auto'}}>
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-card">
          <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src={typeof otherParticipantAvatar === 'string' ? otherParticipantAvatar : ''} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(otherParticipantName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{otherParticipantName}</p>
            <p className="text-xs text-muted-foreground">Direct Message</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Start a conversation!</p>
        </div>
      </div>
    );
  }
  
  // Main chat UI
  return (
    <div className={cn("flex flex-col h-full min-h-screen bg-background", className)} style={{width:'100%', maxWidth:'600px', margin:'0 auto'}}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={typeof otherParticipantAvatar === 'string' ? otherParticipantAvatar : ''} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(otherParticipantName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{otherParticipantName}</p>
          <p className="text-xs text-muted-foreground">Direct Message</p>
        </div>
      </div>
      
      {/* Messages area */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <p>No messages yet.</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender_id === user?.id;
              // Fallback for sender/recipient profile fields
              const senderDisplayName = message.sender?.display_name || 'Unknown';
              const senderAvatarUrl = message.sender?.avatar_url || '';
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    isOwnMessage ? "justify-end" : "justify-start"
                  )}
                >
                  {!isOwnMessage && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={senderAvatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(senderDisplayName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    "max-w-[70%] space-y-1",
                    isOwnMessage ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "rounded-lg px-3 py-2",
                      isOwnMessage 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                  {isOwnMessage && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={senderAvatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(senderDisplayName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Smile className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="pr-10"
              disabled={sending}
            />
          </div>

          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            size="sm"
            className="h-9 w-9 p-0"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};