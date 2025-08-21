import React, { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIAssistant } from '@/hooks/useAIAssistant';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ToolbarAIInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { loading, getGeneralGuidance } = useAIAssistant();

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await getGeneralGuidance(inputMessage.trim());
      
      if (response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "How can I find more clarity today?",
    "What should I focus on right now?",
    "Help me understand this feeling",
    "Guide me through this challenge"
  ];

  return (
    <div className="p-4 w-full max-w-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="font-semibold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Assistant
          </h3>
          <p className="text-xs text-muted-foreground">
            Ask Aura for guidance and insights
          </p>
        </div>

        {/* Messages */}
        <ScrollArea className="h-48 w-full border rounded-lg p-2">
          <div className="space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-xs text-muted-foreground py-4">
                <Sparkles className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                Ask me anything about your spiritual journey
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`text-xs p-2 rounded-lg max-w-[90%] ${
                    message.role === 'user'
                      ? 'bg-blue-500/20 border-blue-500/30 ml-auto text-right'
                      : 'bg-purple-500/20 border-purple-500/30 mr-auto'
                  } border`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground p-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Aura is thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Prompts */}
        {messages.length === 0 && (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Quick prompts:</div>
            <div className="grid gap-1">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(prompt)}
                  className="text-xs p-1 rounded text-left hover:bg-background/50 transition-colors border border-border/50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="space-y-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Aura for guidance..."
            className="min-h-[60px] text-xs resize-none"
            disabled={loading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || loading}
            className="w-full h-8 bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/50 text-blue-300"
            variant="outline"
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <>
                <Send className="h-3 w-3 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};