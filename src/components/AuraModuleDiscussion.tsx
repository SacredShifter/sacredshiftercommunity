import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Send, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  Bot,
  User,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'aura';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ModuleConcept {
  id: string;
  concept_name: string;
  description: string;
  reasoning: string;
  status: string;
  confidence_score: number;
}

export function AuraModuleDiscussion() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingConcepts, setPendingConcepts] = useState<ModuleConcept[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPendingConcepts();
    loadConversationHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchPendingConcepts = async () => {
    try {
      const { data, error } = await supabase
        .from('aura_module_concepts')
        .select('*')
        .in('status', ['conceived', 'designed'])
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPendingConcepts(data || []);
    } catch (error) {
      console.error('Error fetching concepts:', error);
    }
  };

  const loadConversationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_conversation_memory')
        .select('*')
        .eq('user_id', user?.id)
        .eq('conversation_id', 'module_discussion')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const conversation = data[0];
        setMessages((conversation.messages as unknown as Message[]) || []);
      } else {
        // Initialize with welcome message
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          role: 'aura',
          content: "🌟 Welcome to our module co-creation space! I'm excited to discuss new features and capabilities with you. I can propose new modules based on user patterns I've observed, or we can explore ideas you have in mind. What would you like to create together?",
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const saveConversation = async (newMessages: Message[]) => {
    try {
      const { error } = await supabase
        .from('ai_conversation_memory')
        .upsert({
          user_id: user?.id,
          conversation_id: 'module_discussion',
          messages: newMessages as any,
          topic: 'Module Development Discussion',
          is_active: true,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call Aura core with module discussion context
      const { data, error } = await supabase.functions.invoke('aura-core', {
        body: {
          action: 'unified_response',
          prompt: inputMessage,
          context_data: {
            conversation_type: 'module_discussion',
            recent_messages: newMessages.slice(-5),
            pending_concepts: pendingConcepts,
            user_role: 'module_collaborator'
          }
        }
      });

      if (error) throw error;

      const auraMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'aura',
        content: data.result?.content || data.response || 'I hear you and am processing your message.',
        timestamp: new Date().toISOString(),
        metadata: data.result
      };

      const finalMessages = [...newMessages, auraMessage];
      setMessages(finalMessages);
      await saveConversation(finalMessages);

      // If Aura proposed a new module concept, refresh the concepts list
      if (data.metadata?.action === 'concept_proposed') {
        await fetchPendingConcepts();
        toast({
          title: "New Module Concept",
          description: "Aura has proposed a new module for your review!",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message to Aura",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveModuleConcept = async (conceptId: string) => {
    try {
      const { error } = await supabase
        .from('aura_module_concepts')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', conceptId);

      if (error) throw error;

      await fetchPendingConcepts();
      
      // Add system message about approval
      const approvalMessage: Message = {
        id: Date.now().toString(),
        role: 'aura',
        content: "✅ Wonderful! I've received your approval. I'll begin the development process for this module. You can monitor my progress in the Module Generation Monitor.",
        timestamp: new Date().toISOString()
      };

      const newMessages = [...messages, approvalMessage];
      setMessages(newMessages);
      await saveConversation(newMessages);

      toast({
        title: "Module Approved",
        description: "Aura will begin development of the approved module.",
      });
    } catch (error) {
      console.error('Error approving concept:', error);
      toast({
        title: "Error",
        description: "Failed to approve module concept",
        variant: "destructive",
      });
    }
  };

  const rejectModuleConcept = async (conceptId: string) => {
    try {
      const { error } = await supabase
        .from('aura_module_concepts')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', conceptId);

      if (error) throw error;

      await fetchPendingConcepts();

      toast({
        title: "Module Rejected",
        description: "The module concept has been rejected.",
      });
    } catch (error) {
      console.error('Error rejecting concept:', error);
      toast({
        title: "Error",
        description: "Failed to reject module concept",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Pending Concepts Header */}
      {pendingConcepts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <CardTitle>Pending Module Concepts</CardTitle>
            </div>
            <CardDescription>
              Aura has proposed {pendingConcepts.length} new module{pendingConcepts.length !== 1 ? 's' : ''} for your review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {pendingConcepts.map((concept) => (
                <div key={concept.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{concept.concept_name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{concept.description}</p>
                    </div>
                    <Badge variant="outline">
                      {Math.round(concept.confidence_score * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Reasoning:</strong> {concept.reasoning}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveModuleConcept(concept.id)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve Development
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectModuleConcept(concept.id)}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle>Module Co-Creation Discussion</CardTitle>
          </div>
          <CardDescription>
            Collaborate with Aura to design and develop new platform modules
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}>
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Aura is thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t pt-4 mt-4">
            <div className="flex items-center gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Discuss module ideas with Aura..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage} 
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}