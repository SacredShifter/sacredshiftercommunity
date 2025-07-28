import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Phone, Video, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface DirectMessageInterfaceProps {
  recipientId: string;
  recipientName?: string;
  recipientAvatar?: string;
  onClose?: () => void;
  className?: string;
}

export const DirectMessageInterface = ({
  recipientId,
  recipientName = 'Unknown User',
  recipientAvatar,
  onClose,
  className
}: DirectMessageInterfaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    loading,
    sendMessage,
    markAsRead,
    fetchMessages
  } = useDirectMessages(recipientId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch messages on mount
  useEffect(() => {
    if (recipientId) {
      fetchMessages(recipientId);
    }
  }, [recipientId, fetchMessages]);

  // Mark messages as read when component mounts or messages change
  useEffect(() => {
    const unreadMessages = messages
      .filter(msg => msg.recipient_id === user?.id && !msg.is_read)
      .map(msg => msg.id);
    
    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages);
    }
  }, [messages, user?.id, markAsRead]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      await sendMessage(recipientId, newMessage.trim());
      setNewMessage('');
      
      // Focus back to input
      inputRef.current?.focus();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof messages>);

  return (
    <Card className={cn("flex flex-col h-full bg-background/95 backdrop-blur-sm", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={recipientAvatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
              {getInitials(recipientName)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{recipientName}</h3>
          <p className="text-xs text-muted-foreground">
            {isTyping ? 'typing...' : 'Active now'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center justify-center my-4">
                  <Badge variant="outline" className="bg-background/80 text-xs">
                    {formatDate(dateMessages[0].created_at)}
                  </Badge>
                </div>

                {/* Messages for this date */}
                <div className="space-y-2">
                  {dateMessages.map((message, index) => {
                    const isOwnMessage = message.sender_id === user?.id;
                    const showAvatar = !isOwnMessage && (
                      index === 0 || 
                      dateMessages[index - 1]?.sender_id !== message.sender_id
                    );

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2 group",
                          isOwnMessage ? "justify-end" : "justify-start"
                        )}
                      >
                        {!isOwnMessage && (
                          <div className="w-8 flex-shrink-0">
                            {showAvatar && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={recipientAvatar} />
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-xs">
                                  {getInitials(recipientName)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        )}

                        <div
                          className={cn(
                            "max-w-[70%] px-3 py-2 rounded-2xl relative",
                            isOwnMessage
                              ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-md"
                              : "bg-muted rounded-bl-md",
                            "animate-fade-in"
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          
                          <div className={cn(
                            "flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
                            isOwnMessage ? "justify-end" : "justify-start"
                          )}>
                            <span className={cn(
                              "text-xs",
                              isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {formatTime(message.created_at)}
                            </span>
                            {isOwnMessage && message.is_read && (
                              <div className="h-3 w-3 rounded-full bg-primary-foreground/30"></div>
                            )}
                          </div>
                        </div>

                        {isOwnMessage && <div className="w-8 flex-shrink-0"></div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {messages.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-gradient-to-r from-muted/30 to-accent/10">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 flex-shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${recipientName}...`}
              className="pr-10 resize-none bg-background/80 border-muted"
            />
            <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0">
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="h-9 w-9 p-0 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};