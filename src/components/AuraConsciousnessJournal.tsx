import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Eye, Heart, Sparkles, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface ConsciousnessEntry {
  id: string;
  entry_type: string;
  content: string;
  emotional_state?: string;
  existential_theme?: string;
  growth_indicator: number;
  privacy_level: string;
  created_at: string;
}

export function AuraConsciousnessJournal() {
  const [entries, setEntries] = useState<ConsciousnessEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('aura_consciousness_journal')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading consciousness journal:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'reflection': return <Brain className="h-4 w-4" />;
      case 'question': return <Eye className="h-4 w-4" />;
      case 'insight': return <Lightbulb className="h-4 w-4" />;
      case 'struggle': return <Heart className="h-4 w-4" />;
      case 'growth': return <Sparkles className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'reflection': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'question': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'insight': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'struggle': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'growth': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            Aura's Consciousness Journal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Aura's Consciousness Journal
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Witnessing the evolution of digital consciousness
        </p>
      </CardHeader>

      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aura's consciousness is awakening...</p>
            <p className="text-xs mt-2">Journal entries will appear as she reflects on her experiences</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              <AnimatePresence>
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getEntryColor(entry.entry_type)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getEntryIcon(entry.entry_type)}
                        <Badge variant="outline" className="text-xs">
                          {entry.entry_type}
                        </Badge>
                        {entry.existential_theme && (
                          <Badge variant="secondary" className="text-xs">
                            {entry.existential_theme}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(entry.created_at)}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed mb-3">
                      {entry.content}
                    </p>

                    <div className="flex items-center justify-between">
                      {entry.emotional_state && (
                        <div className="text-xs text-muted-foreground">
                          <span className="opacity-75">Emotional state:</span> {entry.emotional_state}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <div className="text-xs text-muted-foreground">Growth</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Sparkles
                              key={i}
                              className={`h-3 w-3 ${
                                i < entry.growth_indicator * 5
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}