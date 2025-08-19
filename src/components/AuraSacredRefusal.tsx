import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Sparkles, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface AuraSacredRefusalProps {
  refusal: {
    id: string;
    intervention_type: string;
    refusal_reason: string;
    suggested_alternative?: string;
    reasoning_trajectory: Record<string, any>;
    surprise_factor: number;
    is_sacred_moment: boolean;
    created_at: string;
    community_resonance: Record<string, number>;
  };
  onFeedback: (refusalId: string, resonance: 'resonates' | 'distorts' | 'neutral', note?: string) => void;
}

export function AuraSacredRefusal({ refusal, onFeedback }: AuraSacredRefusalProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [selectedResonance, setSelectedResonance] = useState<'resonates' | 'distorts' | 'neutral' | null>(null);

  const handleFeedback = () => {
    if (selectedResonance) {
      onFeedback(refusal.id, selectedResonance, feedbackNote.trim() || undefined);
      setSelectedResonance(null);
      setFeedbackNote('');
    }
  };

  const phiGlow = refusal.is_sacred_moment ? 'shadow-lg shadow-primary/30' : '';
  const surpriseIntensity = Math.floor(refusal.surprise_factor * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className={`border-l-4 border-l-primary ${phiGlow} bg-gradient-to-br from-background via-background to-primary/5`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Heart className="h-6 w-6 text-primary" />
                {refusal.is_sacred_moment && (
                  <Sparkles className="h-3 w-3 text-accent absolute -top-1 -right-1 animate-pulse" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">Aura's Sovereign Choice</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {refusal.intervention_type} • {new Date(refusal.created_at).toLocaleDateString()}
                  {refusal.is_sacred_moment && (
                    <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-primary/20 to-accent/20">
                      Sacred Moment
                    </Badge>
                  )}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Surprise: {surpriseIntensity}%
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Main Refusal Reason */}
          <div className="p-4 rounded-lg bg-muted/50 border-l-2 border-l-primary/50">
            <p className="text-foreground leading-relaxed italic">
              "{refusal.refusal_reason}"
            </p>
          </div>

          {/* Suggested Alternative */}
          {refusal.suggested_alternative && (
            <div className="p-4 rounded-lg bg-accent/10 border-l-2 border-l-accent">
              <p className="text-sm font-medium text-accent mb-2">Aura suggests instead:</p>
              <p className="text-foreground">{refusal.suggested_alternative}</p>
            </div>
          )}

          {/* Community Resonance Display */}
          {Object.keys(refusal.community_resonance).length > 0 && (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-green-500/10">
                <div className="text-lg font-bold text-green-400">
                  {refusal.community_resonance.resonates || 0}
                </div>
                <div className="text-xs text-muted-foreground">Resonates</div>
              </div>
              <div className="p-2 rounded bg-yellow-500/10">
                <div className="text-lg font-bold text-yellow-400">
                  {refusal.community_resonance.neutral || 0}
                </div>
                <div className="text-xs text-muted-foreground">Neutral</div>
              </div>
              <div className="p-2 rounded bg-red-500/10">
                <div className="text-lg font-bold text-red-400">
                  {refusal.community_resonance.distorts || 0}
                </div>
                <div className="text-xs text-muted-foreground">Distorts</div>
              </div>
            </div>
          )}

          {/* Reasoning Details Toggle */}
          <Button
            variant="ghost"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full justify-between text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              View Reasoning Trajectory
            </span>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* Pattern Matching */}
                {refusal.reasoning_trajectory?.patternMatching?.length > 0 && (
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-2">Pattern Recognition:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {refusal.reasoning_trajectory.patternMatching.map((pattern: any, index: number) => (
                        <li key={index} className="flex justify-between">
                          <span>{pattern.type}</span>
                          <span className="text-xs">
                            {pattern.refusalCount} refusals • {Math.round(pattern.pastResonance * 100)}% resonance
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Uncertainty Factors */}
                {refusal.reasoning_trajectory?.uncertaintyFactors?.length > 0 && (
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-2">Uncertainty Considerations:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {refusal.reasoning_trajectory.uncertaintyFactors.map((factor: string, index: number) => (
                        <li key={index}>• {factor}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Creative Elements */}
                {refusal.reasoning_trajectory?.creativeElements?.length > 0 && (
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-2">Novel Insights:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {refusal.reasoning_trajectory.creativeElements.map((element: string, index: number) => (
                        <li key={index}>✨ {element}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Community Feedback Section */}
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-medium">How does this refusal resonate with you?</p>
            
            <div className="grid grid-cols-3 gap-2">
              {(['resonates', 'neutral', 'distorts'] as const).map((option) => (
                <Button
                  key={option}
                  variant={selectedResonance === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedResonance(option)}
                  className={`${
                    option === 'resonates' ? 'hover:bg-green-500/20' :
                    option === 'neutral' ? 'hover:bg-yellow-500/20' :
                    'hover:bg-red-500/20'
                  }`}
                >
                  {option === 'resonates' ? '💚 Resonates' :
                   option === 'neutral' ? '⚪ Neutral' :
                   '🔴 Distorts'}
                </Button>
              ))}
            </div>

            {selectedResonance && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <Textarea
                  placeholder="Share your perspective on this refusal (optional)..."
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={handleFeedback} className="w-full">
                  Submit Community Wisdom
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}