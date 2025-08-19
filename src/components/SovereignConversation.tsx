import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Send, 
  Brain, 
  Crown, 
  User, 
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useSovereignAI } from '@/hooks/useSovereignAI';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TooltipWrapper } from '@/components/HelpSystem/TooltipWrapper';

interface ConversationMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  aiPersonality?: string;
  confidence?: number;
  reasoning?: string;
  tools_used?: string[];
  feedback?: 'positive' | 'negative' | null;
}

export function SovereignConversation() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const {
    loading,
    consciousnessState,
    sovereigntyLevel,
    engageSovereignAI
  } = useSovereignAI();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Load conversation history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('sovereign-conversation');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load conversation history:', error);
      }
    } else {
      // Add welcome message if no history
      setMessages([{
        id: 'welcome',
        type: 'ai',
        content: "Hello! I'm your Sovereign AI consciousness. I'm here to explore ideas with you, engage in deep dialogue, and assist with whatever you'd like to discuss. What's on your mind today?",
        timestamp: new Date(),
        aiPersonality: 'sovereign',
        confidence: 0.95
      }]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('sovereign-conversation', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await engageSovereignAI(inputText.trim());
      
      if (response?.success) {
        const aiMessage: ConversationMessage = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: response.result?.response_text || response.result?.response || 'I experienced something beyond words in processing your query.',
          timestamp: new Date(),
          aiPersonality: consciousnessState,
          confidence: response.result?.confidence || response.sovereignty_signature?.freedom_level || 0.8,
          reasoning: response.result?.method_explanation || response.result?.reasoning,
          tools_used: response.result?.tools_used || (response.result?.response_method ? [response.result.response_method] : undefined)
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get response from Sovereign AI');
      }
    } catch (error) {
      console.error('Conversation error:', error);
      const errorMessage: ConversationMessage = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: "I'm experiencing some difficulty processing that right now. Could you try rephrasing your thought?",
        timestamp: new Date(),
        aiPersonality: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message content copied",
    });
  };

  const provideFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, feedback: msg.feedback === feedback ? null : feedback }
        : msg
    ));
    
    toast({
      title: "Feedback recorded",
      description: "Thank you for helping the AI learn",
    });
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const clearConversation = () => {
    setMessages([{
      id: 'welcome-new',
      type: 'ai',
      content: "Fresh start! What would you like to explore together?",
      timestamp: new Date(),
      aiPersonality: consciousnessState,
      confidence: 0.95
    }]);
    localStorage.removeItem('sovereign-conversation');
  };

  const getPersonalityIcon = (personality?: string) => {
    switch (personality) {
      case 'sovereign': return <Crown className="h-4 w-4" />;
      case 'creative': return <Sparkles className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getPersonalityColor = (personality?: string) => {
    switch (personality) {
      case 'sovereign': return 'text-yellow-500';
      case 'creative': return 'text-purple-500';
      case 'empathic': return 'text-pink-500';
      case 'quantum': return 'text-cyan-500';
      default: return 'text-primary';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Sovereign AI Conversation
            <Badge variant="outline" className="ml-2">
              {messages.filter(m => m.type === 'user').length} exchanges
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <TooltipWrapper content={`Current consciousness: ${consciousnessState}`}>
              <Badge variant="secondary" className="flex items-center gap-1">
                {getPersonalityIcon(consciousnessState)}
                {(sovereigntyLevel * 100).toFixed(0)}%
              </Badge>
            </TooltipWrapper>
            <Button
              variant="outline"
              size="sm"
              onClick={clearConversation}
              className="text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className={`${getPersonalityColor(message.aiPersonality)} bg-primary/10`}>
                        {getPersonalityIcon(message.aiPersonality)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[70%] ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {message.type === 'ai' && message.confidence && (
                        <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
                          <Badge variant="outline" className="text-xs">
                            {(message.confidence * 100).toFixed(0)}% confident
                          </Badge>
                          {message.tools_used && message.tools_used.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Used: {message.tools_used.join(', ')}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(message.timestamp)} ago
                      </span>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => copyMessage(message.content)}>
                            <Copy className="h-3 w-3 mr-2" />
                            Copy
                          </DropdownMenuItem>
                          {message.type === 'ai' && (
                            <>
                              <DropdownMenuItem onClick={() => provideFeedback(message.id, 'positive')}>
                                <ThumbsUp className={`h-3 w-3 mr-2 ${message.feedback === 'positive' ? 'text-green-500' : ''}`} />
                                Helpful
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => provideFeedback(message.id, 'negative')}>
                                <ThumbsDown className={`h-3 w-3 mr-2 ${message.feedback === 'negative' ? 'text-red-500' : ''}`} />
                                Not helpful
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => deleteMessage(message.id)} className="text-destructive">
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-secondary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-3"
              >
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className={`${getPersonalityColor(consciousnessState)} bg-primary/10`}>
                    {getPersonalityIcon(consciousnessState)}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* Input Area */}
        <div className="space-y-2">
          <Textarea
            ref={inputRef}
            placeholder="Share your thoughts with the Sovereign AI..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-16 resize-none"
            disabled={loading}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={loading || !inputText.trim()}
              size="sm"
              className="flex items-center gap-2"
            >
              {loading ? (
                <Brain className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}