import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, ArrowLeft, MoreVertical, Phone, Video, Smile } from 'lucide-react';
import { formatDistance } from 'date-fns/formatDistance';
import { toast } from 'sonner';
import { SacredSigilPicker } from './SacredSigilPicker';
import { useSacredSigilEngine } from '@/hooks/useSacredSigilEngine';
import { SacredSigil } from '@/types/sacredSigils';

interface ClassicChatProps {
  selectedUserId: string | null;
  onBack: () => void;
}

export const ClassicChatInterface: React.FC<ClassicChatProps> = ({
  selectedUserId,
  onBack
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const {
    messages,
    sendMessage,
    loading,
    fetchMessages,
    conversations
  } = useDirectMessages();
  const { createSacredMessage, alchemizeMessage } = useSacredSigilEngine();

  // Get selected user from conversations
  const selectedUser = conversations.find(conv => 
    conv.other_participant?.id === selectedUserId
  )?.other_participant;

  // Fetch messages when user is selected
  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId, fetchMessages]);

  // Auto-scroll to bottom only when new messages arrive and user is near bottom
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        
        // Only scroll if user is already near the bottom to avoid disrupting reading
        if (isNearBottom) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedUserId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      // Transform emojis to sigils and create sacred message
      const { content: alchemizedContent } = alchemizeMessage(newMessage.trim());
      await sendMessage(selectedUserId, alchemizedContent);
      setNewMessage('');
      
      toast.success('Message sent');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleSigilSelect = (sigil: SacredSigil) => {
    setNewMessage(prev => prev + sigil.symbol);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (!selectedUserId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-6xl">💬</div>
          <h3 className="text-xl font-semibold text-foreground">Select a conversation</h3>
          <p className="text-muted-foreground">Choose someone to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex-shrink-0 border-b bg-background">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedUser?.avatar_url} />
              <AvatarFallback>
                {selectedUser?.display_name ? getInitials(selectedUser.display_name) : '?'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-foreground">
                {selectedUser?.display_name || 'Unknown User'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isOwnMessage = message.sender_id === user?.id;
              const showAvatar = !isOwnMessage && (
                index === 0 || 
                messages[index - 1]?.sender_id !== message.sender_id
              );
              const showTimestamp = (
                index === messages.length - 1 ||
                messages[index + 1]?.sender_id !== message.sender_id ||
                new Date(messages[index + 1]?.created_at).getTime() - new Date(message.created_at).getTime() > 300000 // 5 minutes
              );

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${
                    showAvatar ? 'mt-4' : 'mt-1'
                  }`}
                >
                  <div className={`flex items-end space-x-2 max-w-[70%] ${
                    isOwnMessage ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                  }`}>
                    {!isOwnMessage && showAvatar && (
                      <Avatar className="h-8 w-8 mb-1">
                        <AvatarImage src={selectedUser?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {selectedUser?.display_name ? getInitials(selectedUser.display_name) : '?'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    {!isOwnMessage && !showAvatar && (
                      <div className="w-8" />
                    )}

                    <div className={`space-y-1 ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      
                      {showTimestamp && (
                        <p className="text-xs text-muted-foreground px-1">
                          {formatMessageTime(message.created_at)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 border-t bg-background p-4">
        <div className="flex items-end space-x-2">
          <SacredSigilPicker onSigilSelect={handleSigilSelect} />
          
          <div className="flex-1 flex items-end space-x-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="min-h-[40px] resize-none border-0 bg-muted focus-visible:ring-1"
              disabled={loading}
            />
            
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || loading}
              size="sm"
              className="mb-1"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};