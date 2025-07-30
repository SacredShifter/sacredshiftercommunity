import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  is_ai_response?: boolean;
}

interface AuraDirectMessageInterfaceProps {
  onClose?: () => void;
  className?: string;
}

export const AuraDirectMessageInterface: React.FC<AuraDirectMessageInterfaceProps> = ({
  onClose,
  className
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { askAssistant, loading: aiLoading } = useAIAssistant();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const AURA_ID = 'aura-ai-assistant';

  // Fetch messages for this conversation with Aura
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('direct_messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${AURA_ID}),and(sender_id.eq.${AURA_ID},recipient_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages((data || []) as DirectMessage[]);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('aura_messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages'
        },
        async (payload) => {
          const newMsg = payload.new as any;
          
          // Only add if it's part of this conversation with Aura
          if ((newMsg.sender_id === user.id && newMsg.recipient_id === AURA_ID) ||
              (newMsg.sender_id === AURA_ID && newMsg.recipient_id === user.id)) {
            setMessages(prev => [...prev, newMsg as DirectMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || isLoading) return;

    const userMessage = newMessage.trim();
    setIsLoading(true);
    setNewMessage('');

    try {
      // Save user message
      const { error: userMsgError } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: AURA_ID,
          content: userMessage,
        });

      if (userMsgError) throw userMsgError;

      // Get AI response
      const aiResponse = await askAssistant({
        request_type: 'general_guidance',
        user_query: userMessage
      });

      if (aiResponse) {
        // Save AI response
        const { error: aiMsgError } = await supabase
          .from('direct_messages')
          .insert({
            sender_id: AURA_ID,
            recipient_id: user.id,
            content: aiResponse,
          });

        if (aiMsgError) throw aiMsgError;
      } else {
        throw new Error('Failed to get AI response');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      setNewMessage(userMessage); // Restore the message
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col h-full bg-background/80 backdrop-blur-sm rounded-lg border ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
            🌟
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">Aura ✨</h3>
          <p className="text-xs text-muted-foreground">AI Assistant</p>
        </div>
        <Bot className="h-4 w-4 text-primary" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-2">🌟</div>
              <p className="text-sm font-medium">Welcome to Aura</p>
              <p className="text-xs mt-1">Your AI assistant for spiritual guidance and growth</p>
              <p className="text-xs mt-2 text-primary">Ask me anything about your spiritual journey...</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender_id === user?.id;
            const isAuraMessage = message.sender_id === AURA_ID;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isOwnMessage && (
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs">
                        🌟
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      isOwnMessage
                        ? 'bg-primary text-primary-foreground'
                        : isAuraMessage 
                        ? 'bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {/* AI Loading indicator */}
        {(isLoading || aiLoading) && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[85%]">
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs">
                  🌟
                </AvatarFallback>
              </Avatar>
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">Aura is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border/50 bg-background/50">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Aura anything..."
            disabled={isLoading || aiLoading}
            className="flex-1"
            autoFocus
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || isLoading || aiLoading}
            size="sm"
            className="px-3"
          >
            {isLoading || aiLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Press Enter to send • Powered by AI
        </p>
      </div>
    </div>
  );
};