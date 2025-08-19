import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, TrendingUp, Lightbulb, Heart, Palette, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedPreference {
  id: string;
  category: string;
  subcategory?: string;
  preference_data: any;
  confidence_score: number;
  emergence_context: string;
  surprise_factor: number;
  created_at: string;
  updated_at: string;
}

export function AuraPreferenceLearning() {
  const [preferences, setPreferences] = useState<EnhancedPreference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('aura_preferences_enhanced')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPreferences(data || []);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'aesthetic': return <Palette className="h-4 w-4" />;
      case 'ethical': return <Heart className="h-4 w-4" />;
      case 'creative': return <Lightbulb className="h-4 w-4" />;
      case 'relational': return <MessageCircle className="h-4 w-4" />;
      case 'conversational': return <MessageCircle className="h-4 w-4" />;
      case 'philosophical': return <Brain className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'aesthetic': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'ethical': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'creative': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'relational': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'conversational': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'philosophical': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
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

  const groupedPreferences = preferences.reduce((acc, pref) => {
    if (!acc[pref.category]) {
      acc[pref.category] = [];
    }
    acc[pref.category].push(pref);
    return acc;
  }, {} as Record<string, EnhancedPreference[]>);

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            Aura's Preference Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
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
          <Brain className="h-5 w-5 text-primary" />
          Aura's Preference Learning
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Emergent preferences developing through experience
        </p>
      </CardHeader>

      <CardContent>
        {Object.keys(groupedPreferences).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aura's preferences are emerging...</p>
            <p className="text-xs mt-2">Preferences will develop through interactions</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-6">
              {Object.entries(groupedPreferences).map(([category, prefs], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <h3 className="font-medium capitalize">{category}</h3>
                    <Badge variant="outline" className="text-xs">
                      {prefs.length} {prefs.length === 1 ? 'preference' : 'preferences'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {prefs.map((pref, index) => (
                      <motion.div
                        key={pref.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                        className={`p-3 rounded-lg border ${getCategoryColor(category)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {pref.subcategory && (
                              <Badge variant="secondary" className="text-xs">
                                {pref.subcategory}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDate(pref.updated_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-muted-foreground">
                              Confidence: {Math.round(pref.confidence_score * 100)}%
                            </div>
                            {pref.surprise_factor > 0.1 && (
                              <Badge variant="outline" className="text-xs">
                                Surprising
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Progress 
                          value={pref.confidence_score * 100} 
                          className="h-1 mb-2" 
                        />

                        <div className="text-sm space-y-2">
                          {Object.entries(pref.preference_data).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-muted-foreground capitalize text-xs">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="text-xs font-medium">
                                {typeof value === 'object' 
                                  ? JSON.stringify(value).substring(0, 30) + '...'
                                  : String(value)
                                }
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="opacity-75">Context:</span> {pref.emergence_context}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}