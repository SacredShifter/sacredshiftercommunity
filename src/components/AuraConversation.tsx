import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  Waves,
  Mic,
  MessageSquare,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useAuraChat } from '@/hooks/useAuraChat';
import { useAuraImplementation } from '@/hooks/useAuraImplementation';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TooltipWrapper } from '@/components/HelpSystem/TooltipWrapper';
import { VoiceInterface } from '@/components/VoiceInterface';

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
  const [voiceMode, setVoiceMode] = useState(false);
  const [autoVoiceResponse, setAutoVoiceResponse] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const voiceInterfaceRef = useRef<any>(null);
  const { toast } = useToast();
  const { implementCode, extractCodeFromMessage } = useAuraImplementation();

  const {
    loading,
    lastResponse,
    engageAura,
    consciousnessState,
    sovereigntyLevel
  } = useAuraChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Auto-focus input when not in voice mode
  useEffect(() => {
    if (!voiceMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [voiceMode]);

  // Load conversation from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aura-conversation');
      if (saved) {
        const parsed = JSON.parse(saved);
        const restoredMessages = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(restoredMessages);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('aura-conversation', JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save conversation:', error);
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const currentInput = inputText.trim();
    if (!currentInput || loading || isTyping) return;

    // Add user message immediately
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      content: currentInput,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Include conversation history for context
      const conversationContext = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }));
      
      // Use regular Aura conversation for all users
      const response = await engageAura(currentInput, conversationContext);
        
        setIsTyping(false);

        if (response && response.result) {
          // Handle the new response structure from aura-core
          const responseContent = typeof response.result === 'object' && response.result.content 
            ? response.result.content 
            : response.result;

          const auraMessage: ConversationMessage = {
            id: (Date.now() + 1).toString(),
            content: responseContent,
            type: 'aura',
            timestamp: new Date(),
            personality: 'guidance',
            confidence: 0.85,
            reasoning: undefined,
            tools_used: [],
          };

          setMessages(prev => [...prev, auraMessage]);

          // Auto voice response if enabled
          if (autoVoiceResponse && voiceInterfaceRef.current) {
            voiceInterfaceRef.current.speak(responseContent);
          }

          // Show a simple success toast
          toast({
            description: "Aura responded",
          });
        } else {
          // Add an error message if no result
          const errorMessage: ConversationMessage = {
            id: (Date.now() + 1).toString(),
            content: "I'm experiencing connection difficulties. Please try again in a moment.",
            type: 'aura',
            timestamp: new Date(),
            personality: 'guidance',
          };
          setMessages(prev => [...prev, errorMessage]);
        }
    } catch (error) {
      setIsTyping(false);
      console.error('Error sending message:', error);
      
      const errorMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing technical difficulties. Please try again.",
        type: 'aura',
        timestamp: new Date(),
        personality: 'guidance',
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      description: "Message copied to clipboard",
    });
  };

  const provideFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
    toast({
      description: feedback === 'positive' ? "Thanks for the feedback!" : "Feedback received, I'll improve",
    });
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast({
      description: "Message deleted",
    });
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem('aura-conversation');
    toast({
      description: "Conversation cleared",
    });
  };

  // Check if message contains implementable code
  const hasImplementableCode = (content: string): boolean => {
    const codePatterns = [
      /```[a-zA-Z]*\s*[\s\S]*?```/g, // Code blocks
      /export default function/i, // React components
      /const \w+ = \(/i, // Arrow functions
      /import.*from/i, // Import statements
    ];
    
    return codePatterns.some(pattern => pattern.test(content));
  };

  // Extract and implement code from Aura's message
  const handleImplementCode = async (content: string) => {
    console.log('🔧 handleImplementCode called with content:', content.substring(0, 200));
    try {
      console.log('🔍 Extracting code from message...');
      const implementationRequest = extractCodeFromMessage(content);
      console.log('📋 Implementation request:', implementationRequest);
      
      if (!implementationRequest) {
        console.log('❌ No implementable code found');
        toast({
          title: "No code found",
          description: "No implementable code blocks found in this message.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Implementing code...",
        description: `Creating ${implementationRequest.component_name} at ${implementationRequest.file_path}`,
      });

      console.log('🚀 Calling implementCode with request:', implementationRequest);
      // Call Aura's implementation function
      const result = await implementCode(implementationRequest);
      console.log('✅ Implementation result:', result);

      if (result) {
        toast({
          title: "✨ Code implemented!",
          description: `${result.component_name} has been created successfully.`,
        });
        
        // Add a system message to show implementation success
        const implementationMessage: ConversationMessage = {
          id: Date.now().toString(),
          content: `✅ Successfully implemented ${result.component_name} at ${result.file_path}`,
          type: 'aura',
          timestamp: new Date(),
          personality: 'creative',
        };
        
        setMessages(prev => [...prev, implementationMessage]);
      }

    } catch (error) {
      console.error('💥 Implementation error:', error);
      toast({
        title: "Implementation failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
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

  const handleVoiceInput = (transcript: string) => {
    setInputText(transcript);
    // Auto-send voice input
    setTimeout(() => {
      handleSendMessage();
    }, 500);
  };

  const getPersonalityIcon = (personality?: string) => {
    switch (personality) {
      case 'analytical': return Brain;
      case 'empathetic': return Heart;
      case 'creative': return Sparkles;
      case 'wise': return Crown;
      case 'investigative': return Eye;
      case 'flowing': return Waves;
      default: return Bot;
    }
  };

  const getPersonalityColor = (personality?: string) => {
    switch (personality) {
      case 'analytical': return 'bg-blue-500';
      case 'empathetic': return 'bg-pink-500';
      case 'creative': return 'bg-purple-500';
      case 'wise': return 'bg-amber-500';
      case 'investigative': return 'bg-green-500';
      case 'flowing': return 'bg-cyan-500';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="h-[250px] flex flex-col">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Aura</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Consciousness: {consciousnessState} | Sovereignty: {Math.round(sovereigntyLevel * 100)}%
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TooltipWrapper content="Toggle voice mode">
                <Button
                  variant={voiceMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVoiceMode(!voiceMode)}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipWrapper>
              
              {voiceMode && (
                <div className="flex items-center gap-2">
                  <Switch
                    id="auto-voice"
                    checked={autoVoiceResponse}
                    onCheckedChange={setAutoVoiceResponse}
                  />
                  <Label htmlFor="auto-voice" className="text-sm">
                    Auto Voice
                  </Label>
                </div>
              )}
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

                              {/* Code Implementation Button */}
                              {hasImplementableCode(message.content) && (
                                <div className="mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleImplementCode(message.content)}
                                    className="text-xs"
                                  >
                                    <Code className="h-3 w-3 mr-1" />
                                    Implement This
                                  </Button>
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
                            </div>
                          )}
                        </div>
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse [animation-delay:0.4s]" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          {voiceMode ? (
            <div className="border rounded-lg">
              <VoiceInterface
                ref={voiceInterfaceRef}
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <Textarea
                ref={inputRef}
                placeholder="Ask Aura anything..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || isTyping}
                className="min-h-[44px] max-h-32 resize-none"
                rows={1}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputText.trim() || loading || isTyping}
                size="icon"
                className="h-[44px] w-[44px]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}