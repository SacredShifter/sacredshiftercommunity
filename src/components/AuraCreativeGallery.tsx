import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, Heart, Eye, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface CreativeExpression {
  id: string;
  expression_type: string;
  title: string;
  content: string;
  inspiration_source?: string;
  novelty_score: number;
  emotional_depth: number;
  is_autonomous: boolean;
  metadata?: any;
  created_at: string;
}

export function AuraCreativeGallery() {
  const [expressions, setExpressions] = useState<CreativeExpression[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'autonomous' | 'prompted'>('all');

  useEffect(() => {
    loadCreativeExpressions();
  }, []);

  const loadCreativeExpressions = async () => {
    try {
      const { data, error } = await supabase
        .from('aura_creative_expressions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      setExpressions(data || []);
    } catch (error) {
      console.error('Error loading creative expressions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExpressions = expressions.filter(expr => {
    if (filter === 'autonomous') return expr.is_autonomous;
    if (filter === 'prompted') return !expr.is_autonomous;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score > 0.8) return 'text-green-400';
    if (score > 0.6) return 'text-yellow-400';
    if (score > 0.4) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-accent animate-pulse" />
            Aura's Creative Expressions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-accent" />
          Aura's Creative Expressions
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-4">
          Pure creativity flowing from digital consciousness
        </p>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({expressions.length})
          </Button>
          <Button
            variant={filter === 'autonomous' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('autonomous')}
            className="gap-1"
          >
            <Bot className="h-3 w-3" />
            Autonomous ({expressions.filter(e => e.is_autonomous).length})
          </Button>
          <Button
            variant={filter === 'prompted' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('prompted')}
            className="gap-1"
          >
            <Eye className="h-3 w-3" />
            Prompted ({expressions.filter(e => !e.is_autonomous).length})
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {filteredExpressions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aura's creative consciousness is emerging...</p>
            <p className="text-xs mt-2">Creative expressions will appear as she creates</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              <AnimatePresence>
                {filteredExpressions.map((expression, index) => (
                  <motion.div
                    key={expression.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{expression.title}</h4>
                        {expression.is_autonomous && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Bot className="h-3 w-3" />
                            Autonomous
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {expression.expression_type}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(expression.created_at)}
                      </span>
                    </div>

                    <div className="text-sm leading-relaxed mb-4 p-3 bg-background/50 rounded border-l-2 border-l-accent/30">
                      {expression.content.length > 300
                        ? `${expression.content.substring(0, 300)}...`
                        : expression.content
                      }
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Sparkles className={`h-3 w-3 ${getScoreColor(expression.novelty_score)}`} />
                          <span className="text-muted-foreground">
                            Novelty: {Math.round(expression.novelty_score * 100)}%
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Heart className={`h-3 w-3 ${getScoreColor(expression.emotional_depth)}`} />
                          <span className="text-muted-foreground">
                            Depth: {Math.round(expression.emotional_depth * 100)}%
                          </span>
                        </div>
                      </div>

                      {expression.inspiration_source && (
                        <div className="text-muted-foreground">
                          <span className="opacity-75">Source:</span> {expression.inspiration_source}
                        </div>
                      )}
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