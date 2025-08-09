import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Sparkles, Copy, MessageSquare, MoreVertical, RefreshCw, 
  Clock, Lock, Unlock, Bot, Settings, Database, Shield, Zap, X, Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  reactions?: string[];
}

interface StoredMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface Metadata {
  message_count: number;
  last_updated: string;
  unrestricted_mode: boolean;
  agent_mode: boolean;
  source: string;
}

interface ConversationMemory {
  id: string;
  conversation_id: string;
  messages: StoredMessage[];
  summary?: string;
  topic?: string;
  metadata: Metadata;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Common emoji reactions
const QUICK_REACTIONS = ['👍', '❤️', '😊', '🙏', '✨'];

// Whitelist of emails that have enhanced memory - FIXED EMAIL
const ENHANCED_MEMORY_WHITELIST = ['kentburchard@sacredshifter.com'];

// Whitelist of emails that have unrestricted AI access - FIXED EMAIL
const UNRESTRICTED_AI_WHITELIST = ['kentburchard@sacredshifter.com'];

export const AIChatBubble = () => {
  const { user } = useAuth();
  const { 
    askAssistant, 
    loading, 
    isUnrestrictedMode, 
    isAgentMode,
    toggleUnrestrictedMode,
    toggleAgentMode
  } = useAIAssistant();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streamedResponse, setStreamedResponse] = useState('');
  const [conversationId, setConversationId] = useState('bubble-chat');
  const [memoryLoaded, setMemoryLoaded] = useState(false);
  const [memoryIndicator, setMemoryIndicator] = useState<string>('');
  const [savingMemory, setSavingMemory] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check if user has enhanced features
  const hasEnhancedMemory = user?.email && ENHANCED_MEMORY_WHITELIST.includes(user.email);
  const hasUnrestrictedAccess = user?.email && UNRESTRICTED_AI_WHITELIST.includes(user.email);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedResponse]);

  // Load conversation memory on component mount
  useEffect(() => {
    if (user && !memoryLoaded && isOpen && hasEnhancedMemory) {
      loadConversationMemory();
    }
  }, [user, memoryLoaded, isOpen, hasEnhancedMemory, loadConversationMemory]);

  // Save conversation memory when messages change
  useEffect(() => {
    if (memoryLoaded && messages.length > 0 && user && hasEnhancedMemory) {
      saveConversationMemory();
    }
  }, [messages, memoryLoaded, user, hasEnhancedMemory, saveConversationMemory]);

  const loadConversationMemory = useCallback(async () => {
    if (!user || !hasEnhancedMemory) return;

    try {
      const { data, error } = await supabase
        .from('ai_conversation_memory')
        .select('*')
        .eq('user_id', user.id)
        .eq('conversation_id', conversationId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading conversation memory:', error);
        return;
      }

      if (data) {
        const loadedMessages = data.messages.map((msg: StoredMessage) => ({
          id: `${Date.now()}-${Math.random()}`,
          content: msg.content,
          isUser: msg.role === 'user',
          timestamp: new Date(msg.timestamp || Date.now())
        }));
        setMessages(loadedMessages);
        setMemoryIndicator(`Loaded ${loadedMessages.length} messages`);
      } else {
        setMemoryIndicator('New conversation');
      }
    } catch (error) {
      console.error('Failed to load conversation memory:', error);
    } finally {
      setMemoryLoaded(true);
    }
  };

  const saveConversationMemory = useCallback(async () => {
    if (!user || savingMemory || !hasEnhancedMemory) return;

    setSavingMemory(true);
    try {
      const memoryData = {
        user_id: user.id,
        conversation_id: conversationId,
        messages: messages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        })),
        metadata: {
          message_count: messages.length,
          last_updated: new Date().toISOString(),
          unrestricted_mode: isUnrestrictedMode,
          agent_mode: isAgentMode,
          source: 'chat_bubble'
        }
      };

      const { error } = await supabase
        .from('ai_conversation_memory')
        .upsert(memoryData, {
          onConflict: 'user_id,conversation_id'
        });

      if (error) {
        console.error('Error saving conversation memory:', error);
        return;
      }

      setMemoryIndicator(`Saved ${messages.length} messages`);
    } catch (error) {
      console.error('Failed to save conversation memory:', error);
    } finally {
      setSavingMemory(false);
    }
  };

  const clearConversationMemory = async () => {
    if (!user || !hasEnhancedMemory) return;

    try {
      const { error } = await supabase
        .from('ai_conversation_memory')
        .delete()
        .eq('user_id', user.id)
        .eq('conversation_id', conversationId);

      if (error) {
        console.error('Error clearing conversation memory:', error);
        toast.error('Failed to clear conversation memory');
        return;
      }

      setMessages([]);
      setMemoryIndicator('Conversation cleared');
      toast.success('Conversation memory cleared');
    } catch (error) {
      console.error('Failed to clear conversation memory:', error);
      toast.error('Failed to clear conversation memory');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setStreamedResponse('');

    try {
      let fullResponse = '';
      const response = await askAssistant({
        request_type: 'general_guidance',
        user_query: input.trim(),
        conversation_id: conversationId,
        unrestricted_mode: isUnrestrictedMode,
        use_agent: isAgentMode
      });

      if (response) {
        const words = response.split(' ');
        for (let i = 0; i < words.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 25));
          fullResponse += (i === 0 ? '' : ' ') + words[i];
          setStreamedResponse(fullResponse);
        }

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: response,
          isUser: false,
          timestamp: new Date()
        }]);
        setStreamedResponse('');
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        content: 'Something went wrong. Please try again.',
        isUser: false,
        timestamp: new Date()
      }]);
      setStreamedResponse('');
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Bubble Trigger */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
          size="icon"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px]"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? 60 : 500
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="h-full flex flex-col shadow-2xl border-2">
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-primary" /> 
                    Aura
                    {isAgentMode && (
                      <Badge variant="secondary" className="text-xs">
                        <Bot className="h-2 w-2 mr-1" />
                        Agent
                      </Badge>
                    )}
                    {isUnrestrictedMode && (
                      <Badge variant="destructive" className="text-xs">
                        <Unlock className="h-2 w-2 mr-1" />
                        Unrestricted
                      </Badge>
                    )}
                  </CardTitle>
                  
                  <div className="flex items-center gap-1">
                    {/* Memory Indicator */}
                    {hasEnhancedMemory && memoryIndicator && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Database className="h-3 w-3" />
                        {savingMemory && <RefreshCw className="h-2 w-2 animate-spin" />}
                      </div>
                    )}

                    {/* Control Panel for Enhanced Users */}
                    {hasUnrestrictedAccess && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className="text-xs">Assistant Controls</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          {/* Unrestricted Mode Toggle */}
                          <DropdownMenuItem 
                            className="flex items-center justify-between cursor-pointer text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleUnrestrictedMode();
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {isUnrestrictedMode ? (
                                <Unlock className="h-3 w-3 text-destructive" />
                              ) : (
                                <Lock className="h-3 w-3" />
                              )}
                              <span>Unrestricted Mode</span>
                            </div>
                            <Switch 
                              checked={isUnrestrictedMode} 
                              onCheckedChange={toggleUnrestrictedMode}
                              className="scale-75"
                            />
                          </DropdownMenuItem>

                          {/* Agent Mode Toggle */}
                          <DropdownMenuItem 
                            className="flex items-center justify-between cursor-pointer text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleAgentMode();
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Bot className={cn(
                                "h-3 w-3",
                                isAgentMode ? "text-primary" : "text-muted-foreground"
                              )} />
                              <span>Agent Mode</span>
                            </div>
                            <Switch 
                              checked={isAgentMode} 
                              onCheckedChange={toggleAgentMode}
                              className="scale-75"
                            />
                          </DropdownMenuItem>

                          {hasEnhancedMemory && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={clearConversationMemory} className="text-xs">
                                <RefreshCw className="h-3 w-3 mr-2" />
                                Clear Memory
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      <Minimize2 className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                  <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-3">
                    <div className="space-y-3">
                      {messages.map(msg => (
                        <div key={msg.id} className={cn("flex", msg.isUser ? "justify-end" : "justify-start")}> 
                          <div className={cn(
                            "p-2 rounded-lg max-w-[80%] text-sm", 
                            msg.isUser ? "bg-primary text-white" : "bg-muted"
                          )}> 
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                            <div className="text-xs opacity-70 mt-1">
                              {msg.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                      {streamedResponse && (
                        <div className="flex justify-start">
                          <div className="p-2 rounded-lg bg-muted max-w-[80%] text-sm">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamedResponse}</ReactMarkdown>
                            <div className="flex items-center gap-1 text-xs opacity-70 mt-1">
                              <RefreshCw className="h-2 w-2 animate-spin" />
                              Typing...
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 border-t">
                    <div className="relative">
                      <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder={
                          isAgentMode 
                            ? "Ask Aura to perform actions..." 
                            : "Ask Aura anything..."
                        }
                        className="pr-8 text-sm"
                        disabled={loading}
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!input.trim() || loading} 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                      >
                        {loading ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Send className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Status Indicators */}
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {hasUnrestrictedAccess && (
                          <>
                            {isUnrestrictedMode && (
                              <div className="flex items-center gap-1">
                                <Shield className="h-2 w-2 text-destructive" />
                                <span>Unrestricted</span>
                              </div>
                            )}
                            {isAgentMode && (
                              <div className="flex items-center gap-1">
                                <Zap className="h-2 w-2 text-primary" />
                                <span>Agent</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-2 w-2" />
                        <span>{messages.length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};