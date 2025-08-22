import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { MessageReactions } from './MessageReactions';

interface ThreadMessage {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  chakra_tag?: string;
  is_anonymous?: boolean;
  reactions?: any[];
}

interface MessageThreadProps {
  parentMessageId: string;
  circleId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MessageThread = ({ parentMessageId, circleId, isOpen, onClose }: MessageThreadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen && parentMessageId) {
      fetchThreadMessages();
    }
  }, [isOpen, parentMessageId]);

  const fetchThreadMessages = async () => {
    setLoading(true);
    try {
      // For now, return empty array as threading isn't implemented in the schema
      setThreadMessages([]);
    } catch (error) {
      console.error('Error fetching thread messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!newReply.trim() || !user) return;

    setSending(true);
    try {
      // Threading functionality not implemented in schema yet
      toast({
        title: "Feature Coming Soon",
        description: "Thread replies will be available soon.",
      });
      setNewReply('');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getInitials = (userId: string) => {
    return userId.slice(0, 2).toUpperCase();
  };

  const getChakraColor = (chakraTag?: string) => {
    const colors = {
      root: 'from-red-400 to-red-600',
      sacral: 'from-orange-400 to-orange-600',
      solar: 'from-yellow-400 to-yellow-600',
      heart: 'from-green-400 to-green-600',
      throat: 'from-blue-400 to-blue-600',
      third_eye: 'from-indigo-400 to-indigo-600',
      crown: 'from-purple-400 to-purple-600',
    };
    return colors[chakraTag as keyof typeof colors] || 'from-primary to-primary/80';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="border-l-2 border-primary/20 ml-8 mt-2 pl-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Thread</span>
          <Badge variant="outline" className="text-xs">
            {threadMessages.length} replies
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          ×
        </Button>
      </div>

      <ScrollArea className="max-h-64 mb-3">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {threadMessages.map((message) => {
              const isOwnMessage = message.user_id === user?.id;
              
              return (
                <div
                  key={message.id}
                  className={cn("flex gap-2", isOwnMessage ? "justify-end" : "justify-start")}
                >
                  {!isOwnMessage && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={cn(
                        "bg-gradient-to-br text-white text-xs",
                        getChakraColor(message.chakra_tag)
                      )}>
                        {getInitials(message.user_id)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="max-w-[80%]">
                    <div
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm",
                        isOwnMessage
                          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="break-words">{message.content}</p>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-70">
                          {formatTime(message.created_at)}
                        </span>
                        {message.chakra_tag && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs bg-gradient-to-r text-white border-none",
                              getChakraColor(message.chakra_tag)
                            )}
                          >
                            {message.chakra_tag}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <MessageReactions
                      messageId={message.id}
                      reactions={message.reactions || []}
                      onReactionUpdate={fetchThreadMessages}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Reply input */}
      <div className="flex gap-2">
        <Input
          placeholder="Reply to thread..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendReply();
            }
          }}
          disabled={sending}
          className="text-sm"
        />
        <Button
          onClick={handleSendReply}
          disabled={!newReply.trim() || sending}
          size="sm"
          className="px-3"
        >
          {sending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};