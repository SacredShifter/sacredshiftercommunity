import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { TooltipWrapper } from '@/components/HelpSystem/TooltipWrapper';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatBubbleProps {
  className?: string;
}

export const AIChatBubble = ({ className }: AIChatBubbleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "🌟 Welcome, sacred seeker! I'm your AI guide for consciousness exploration. I can help you with spiritual insights, dream interpretation, reflection on your registry entries, and guidance on your transformation journey. How may I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { loading, getGeneralGuidance, analyzeRegistry, reflectOnJournal, getCircleGuidance } = useAIAssistant();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');

    try {
      // Determine the best AI request type based on message content
      let response: string | null = null;
      const lowerMessage = currentMessage.toLowerCase();
      
      if (lowerMessage.includes('registry') || lowerMessage.includes('resonance') || lowerMessage.includes('synchronic')) {
        response = await analyzeRegistry(currentMessage);
      } else if (lowerMessage.includes('journal') || lowerMessage.includes('reflection') || lowerMessage.includes('dream')) {
        response = await reflectOnJournal(currentMessage);
      } else if (lowerMessage.includes('circle') || lowerMessage.includes('community') || lowerMessage.includes('sacred')) {
        response = await getCircleGuidance(currentMessage);
      } else {
        response = await getGeneralGuidance(currentMessage);
      }

      if (response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. 🙏",
        timestamp: new Date()
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickPrompts = [
    "Help me interpret a recent dream",
    "Analyze patterns in my spiritual journey",
    "What does this synchronicity mean?",
    "Guide me through a reflection",
    "Explain sacred geometry",
    "What's my next step in consciousness expansion?"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      {/* AI Chat Bubble */}
      {!isOpen && (
        <TooltipWrapper content="Open AI spiritual guide - get insights, interpretations, and guidance on your consciousness journey">
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-105 relative group"
          >
            <Bot className="h-6 w-6 text-white" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
          </Button>
        </TooltipWrapper>
      )}

      {/* AI Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-96 h-[500px] flex flex-col shadow-2xl bg-background/95 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-800">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500">
                      <AvatarFallback className="bg-transparent">
                        <Bot className="h-5 w-5 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Sacred AI Guide</h3>
                    <p className="text-xs text-muted-foreground">Consciousness & Spirituality Assistant</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
                          <AvatarFallback className="bg-transparent">
                            <Bot className="h-4 w-4 text-white" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted'
                      )}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={cn(
                          "text-xs mt-1 opacity-70",
                          message.role === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                        )}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 flex-shrink-0">
                          <AvatarFallback className="bg-transparent text-primary-foreground text-xs">
                            You
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                  
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 justify-start"
                    >
                      <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500">
                        <AvatarFallback className="bg-transparent">
                          <Loader2 className="h-4 w-4 text-white animate-spin" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-muted-foreground">Receiving guidance...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Prompts */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2">
                  <p className="text-xs text-muted-foreground mb-2">Quick prompts:</p>
                  <div className="flex flex-wrap gap-1">
                    {quickPrompts.slice(0, 3).map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => handleQuickPrompt(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t bg-background/50">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask for spiritual guidance..."
                    className="flex-1 bg-background/80"
                    disabled={loading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || loading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Press Enter to send • Your sacred guide for consciousness exploration
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};