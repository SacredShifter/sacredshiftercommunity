// RESTORED VERSION OF AIAssistantPage WITH MEMORY AND CONTROL MODES

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, Sparkles, Copy, MessageSquare, MoreVertical, RefreshCw, 
  Clock, Lock, Unlock, Bot, Settings, Database, Shield, Zap
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

interface ConversationMemory {
  id: string;
  user_id: string;
  conversation_id: string;
  messages: any[];
  metadata: any;
  created_at: string;
  updated_at: string;
}

const AIAssistantPage = () => {
  const { user } = useAuth();
  const { 
    askAssistant, 
    loading, 
    isUnrestrictedMode, 
    isAgentMode,
    toggleUnrestrictedMode,
    toggleAgentMode
  } = useAIAssistant();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streamedResponse, setStreamedResponse] = useState('');
  const [conversationId, setConversationId] = useState('default');
  const [memoryLoaded, setMemoryLoaded] = useState(false);
  const [memoryIndicator, setMemoryIndicator] = useState<string>('');
  const [savingMemory, setSavingMemory] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Whitelisted users for unrestricted and agent modes - FIXED EMAIL
  const whitelistedUsers = [
    'kentburchard@sacredshifter.com',
    'admin@sacredshifter.com'
  ];

  const isWhitelisted = user?.email && whitelistedUsers.includes(user.email);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedResponse]);

  // Load conversation memory on component mount - ONLY if whitelisted
  useEffect(() => {
    if (user && !memoryLoaded && isWhitelisted) {
      loadConversationMemory();
    } else if (user && !isWhitelisted) {
      setMemoryLoaded(true);
      setMemoryIndicator('Memory not available');
    }
  }, [user, memoryLoaded, isWhitelisted]);

  // Save conversation memory when messages change - ONLY if whitelisted
  useEffect(() => {
    if (memoryLoaded && messages.length > 0 && user && isWhitelisted) {
      saveConversationMemory();
    }
  }, [messages, memoryLoaded, user, isWhitelisted]);

  const loadConversationMemory = async () => {
    if (!user || !isWhitelisted) return;

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
        setMemoryIndicator('Memory unavailable');
        return;
      }

      if (data) {
        const loadedMessages = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(loadedMessages);
        setMemoryIndicator(`Loaded ${loadedMessages.length} messages`);
        toast.success('Conversation memory loaded');
      } else {
        setMemoryIndicator('No previous conversation found');
      }
    } catch (error) {
      console.error('Failed to load conversation memory:', error);
      setMemoryIndicator('Memory unavailable');
    } finally {
      setMemoryLoaded(true);
    }
  };

  const saveConversationMemory = async () => {
    if (!user || savingMemory || !isWhitelisted) return;

    setSavingMemory(true);
    try {
      const memoryData = {
        user_id: user.id,
        conversation_id: conversationId,
        messages: messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        })),
        metadata: {
          message_count: messages.length,
          last_updated: new Date().toISOString(),
          unrestricted_mode: isUnrestrictedMode,
          agent_mode: isAgentMode
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
    if (!user || !isWhitelisted) return;

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
    <div className="flex flex-col h-full">
      <Card className="flex flex-col h-full w-full max-w-4xl mx-auto bg-background/80 backdrop-blur-md">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" /> 
              Aura
              {isAgentMode && (
                <Badge variant="secondary" className="ml-2">
                  <Bot className="h-3 w-3 mr-1" />
                  Agent
                </Badge>
              )}
              {isUnrestrictedMode && (
                <Badge variant="destructive" className="ml-2">
                  <Unlock className="h-3 w-3 mr-1" />
                  Unrestricted
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {/* Memory Indicator */}
              {isWhitelisted && memoryIndicator && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Database className="h-4 w-4" />
                  <span>{memoryIndicator}</span>
                  {savingMemory && <RefreshCw className="h-3 w-3 animate-spin" />}
                </div>
              )}

              {/* Control Panel for Whitelisted Users */}
              {isWhitelisted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Assistant Controls</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Unrestricted Mode Toggle */}
                    <div className="flex items-center justify-between px-2 py-2">
                      <div className="flex items-center gap-2">
                        {isUnrestrictedMode ? (
                          <Unlock className="h-4 w-4 text-destructive" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                        <span>Unrestricted Mode</span>
                      </div>
                      <Switch 
                        checked={isUnrestrictedMode} 
                        onCheckedChange={toggleUnrestrictedMode}
                      />
                    </div>

                    {/* Agent Mode Toggle */}
                    <div className="flex items-center justify-between px-2 py-2">
                      <div className="flex items-center gap-2">
                        <Bot className={cn(
                          "h-4 w-4",
                          isAgentMode ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span>Agent Mode</span>
                      </div>
                      <Switch 
                        checked={isAgentMode} 
                        onCheckedChange={toggleAgentMode}
                      />
                    </div>

                    <DropdownMenuSeparator />
                    
                    {/* Memory Controls */}
                    <DropdownMenuItem onClick={clearConversationMemory}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Memory
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* General Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setMessages([])}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(messages.map(m => `${m.isUser ? 'You' : 'Aura'}: ${m.content}`).join('\n'))}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-2">
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={cn("flex", msg.isUser ? "justify-end" : "justify-start")}> 
                  <div className={cn(
                    "p-3 rounded-lg max-w-[80%]", 
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
                  <div className="p-3 rounded-lg bg-muted max-w-[80%]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamedResponse}</ReactMarkdown>
                    <div className="flex items-center gap-1 text-xs opacity-70 mt-1">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Typing...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t">
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
                className="pr-10"
                disabled={loading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim() || loading} 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                {isWhitelisted && (
                  <>
                    {isUnrestrictedMode && (
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-destructive" />
                        <span>Unrestricted</span>
                      </div>
                    )}
                    {isAgentMode && (
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-primary" />
                        <span>Agent Active</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{messages.length} messages</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantPage;