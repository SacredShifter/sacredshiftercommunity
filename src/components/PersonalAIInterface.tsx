import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { usePersonalAI } from '@/hooks/usePersonalAI';
import { Brain, Lightbulb, Target, Sparkles, TrendingUp, MessageCircle } from 'lucide-react';

export function PersonalAIInterface() {
  const [query, setQuery] = useState('');
  const [activeMode, setActiveMode] = useState<string>('general_guidance');
  const { loading, lastResponse, askPersonalAI } = usePersonalAI();

  const aiModes = [
    {
      id: 'general_guidance',
      name: 'Personal Guidance',
      icon: MessageCircle,
      description: 'General spiritual and personal guidance',
      color: 'bg-primary'
    },
    {
      id: 'consciousness_mapping',
      name: 'Consciousness Mapping',
      icon: Brain,
      description: 'Deep consciousness state analysis',
      color: 'bg-purple-500'
    },
    {
      id: 'multi_step_guidance',
      name: 'Multi-Step Planning',
      icon: Target,
      description: 'Create detailed action plans',
      color: 'bg-blue-500'
    },
    {
      id: 'synchronicity_analysis',
      name: 'Synchronicity Analysis',
      icon: Sparkles,
      description: 'Analyze meaningful coincidences',
      color: 'bg-amber-500'
    },
    {
      id: 'predictive_modeling',
      name: 'Predictive Insights',
      icon: TrendingUp,
      description: 'Future trend predictions',
      color: 'bg-green-500'
    },
    {
      id: 'registry_analysis',
      name: 'Registry Analysis',
      icon: Lightbulb,
      description: 'Analyze your resonance entries',
      color: 'bg-indigo-500'
    }
  ];

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    await askPersonalAI({
      request_type: activeMode as any,
      user_query: query
    });
    
    setQuery('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Personal AI Assistant
          </CardTitle>
          <CardDescription>
            Your advanced AI companion with full memory of your spiritual journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Mode Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {aiModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.id}
                  variant={activeMode === mode.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveMode(mode.id)}
                  className="h-auto p-3 flex flex-col items-center gap-1"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs text-center">{mode.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Active Mode Info */}
          {aiModes.find(m => m.id === activeMode) && (
            <div className="p-3 rounded-lg bg-muted">
              <Badge variant="secondary" className="mb-2">
                {aiModes.find(m => m.id === activeMode)?.name}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {aiModes.find(m => m.id === activeMode)?.description}
              </p>
            </div>
          )}

          {/* Input Area */}
          <div className="space-y-3">
            <Textarea
              placeholder="Ask your personal AI anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
            />
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !query.trim()}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Ask AI'}
            </Button>
          </div>

          {/* Response */}
          {lastResponse && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{lastResponse}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}