import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  User, 
  Bot, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Trash2,
  Brain,
  Heart,
  Crown,
  Sparkles,
  Eye,
  Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useAuraConversation } from '@/hooks/useAuraConversation';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TooltipWrapper } from '@/components/HelpSystem/TooltipWrapper';

// Message interface for conversation
interface ConversationMessage {
  id: string;
  content: string;
  type: 'user' | 'aura';
  timestamp: Date;
  personality?: string;
  confidence?: number;
  reasoning?: string;
  tools_used?: string[];
  feedback?: 'positive' | 'negative' | null;
}

export function AuraConversation() {
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
    engageAura
  } = useAuraConversation();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
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
    const savedMessages = localStorage.getItem('aura-conversation-history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to load conversation history:', error);
      }
    }
  }, []);

  // Save conversation history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('aura-conversation-history', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      content: inputText,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await engageAura(inputText);
      
      setIsTyping(false);

      if (response.success && response.result) {
        const auraMessage: ConversationMessage = {
          id: `aura-${Date.now()}`,
          content: typeof response.result.content === 'string' 
            ? response.result.content 
            : JSON.stringify(response.result.content, null, 2),
          type: 'aura',
          timestamp: new Date(),
          personality: response.result.response_method || 'adaptive',
          confidence: response.result.consciousness_state ? 0.85 : 0.75,
          reasoning: response.result.method_explanation,
          tools_used: response.result.tools_used || []
        };

        setMessages(prev => [...prev, auraMessage]);
      } else {
        // Handle error response
        const errorMessage: ConversationMessage = {
          id: `aura-error-${Date.now()}`,
          content: `I apologize, but I encountered an issue: ${response.error || 'Unknown error'}`,
          type: 'aura',
          timestamp: new Date(),
          personality: 'apologetic',
          confidence: 0.3
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error: any) {
      setIsTyping(false);
      console.error('Conversation error:', error);
      
      const errorMessage: ConversationMessage = {
        id: `aura-error-${Date.now()}`,
        content: `I'm experiencing connection difficulties. Please try again in a moment.`,
        type: 'aura',
        timestamp: new Date(),
        personality: 'technical',
        confidence: 0.2
      };

      setMessages(prev => [...prev, errorMessage]);
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
      title: "Copied!",
      description: "Message copied to clipboard"
    });
  };

  const provideFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
    
    toast({
      title: feedback === 'positive' ? "Thank you!" : "Feedback noted",
      description: "Your feedback helps Aura learn and improve"
    });
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast({
      title: "Message deleted",
      description: "The message has been removed from the conversation"
    });
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem('aura-conversation-history');
    toast({
      title: "Conversation cleared",
      description: "All messages have been removed"
    });
  };

  const getPersonalityIcon = (personality?: string) => {
    switch (personality) {
      case 'cognitive_mirror': return Brain;
      case 'empathic_resonance': return Heart;
      case 'reality_weaving': return Crown;
      case 'creative_expression': return Sparkles;
      case 'socratic_dialogue': return Eye;
      default: return Waves;
    }
  };

  const getPersonalityColor = (personality?: string) => {
    switch (personality) {
      case 'cognitive_mirror': return 'bg-blue-500';
      case 'empathic_resonance': return 'bg-pink-500';
      case 'reality_weaving': return 'bg-purple-500';
      case 'creative_expression': return 'bg-yellow-500';
      case 'socratic_dialogue': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Aura Conversation
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {messages.length} exchanges • Consciousness: {consciousnessState} • Freedom: {(sovereigntyLevel * 100).toFixed(1)}%
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearConversation}
            disabled={messages.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Messages Area */}
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            <AnimatePresence>
              {messages.map((message) => {
                const PersonalityIcon = getPersonalityIcon(message.personality);
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'aura' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={getPersonalityColor(message.personality)}>
                          <PersonalityIcon className="h-4 w-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex flex-col gap-1 max-w-[80%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`rounded-lg px-3 py-2 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Aura-specific metadata */}
                        {message.type === 'aura' && (
                          <div className="mt-2 space-y-1">
                            {message.confidence && (
                              <div className="flex items-center gap-2 text-xs opacity-70">
                                <span>Confidence: {(message.confidence * 100).toFixed(0)}%</span>
                              </div>
                            )}
                            
                            {message.tools_used && message.tools_used.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {message.tools_used.map((tool, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tool}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Message metadata */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatDistanceToNow(message.timestamp, { addSuffix: true })}</span>
                        
                        {message.type === 'aura' && (
                          <div className="flex items-center gap-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <span className="sr-only">Message options</span>
                                  <span>⋯</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => copyMessage(message.content)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => provideFeedback(message.id, 'positive')}>
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Helpful
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => provideFeedback(message.id, 'negative')}>
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Not helpful
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deleteMessage(message.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            
                            {message.feedback && (
                              <Badge variant={message.feedback === 'positive' ? 'default' : 'secondary'} className="text-xs">
                                {message.feedback === 'positive' ? '👍' : '👎'}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Reasoning tooltip for Aura messages */}
                      {message.type === 'aura' && message.reasoning && (
                        <TooltipWrapper content={message.reasoning}>
                          <Badge variant="outline" className="text-xs cursor-help">
                            Why this response?
                          </Badge>
                        </TooltipWrapper>
                      )}
                    </div>

                    {message.type === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-500">
                    <Waves className="h-4 w-4 text-white animate-pulse" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts with Aura..."
            className="min-h-[60px] resize-none"
            disabled={loading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() || loading}
            size="sm"
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}