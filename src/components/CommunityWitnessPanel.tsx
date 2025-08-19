import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, AlertTriangle, Minus } from 'lucide-react';
import { AuraAuditEntry, CommunityFeedback, ResonanceType } from '@/aura/schema';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommunityWitnessPanelProps {
  auditEntry: AuraAuditEntry;
  feedback?: CommunityFeedback[];
  onFeedbackSubmitted?: () => void;
}

export function CommunityWitnessPanel({ auditEntry, feedback = [], onFeedbackSubmitted }: CommunityWitnessPanelProps) {
  const [resonance, setResonance] = useState<ResonanceType>('neutral');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = async () => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      // Check if user already provided feedback
      const existingFeedback = feedback.find(f => f.user_id === user.id);
      
      if (existingFeedback) {
        // Update existing feedback
        const { error } = await supabase
          .from('community_feedback')
          .update({
            resonance,
            note: note.trim() || null,
            trust_weight: await calculateUserTrustWeight(user.id)
          })
          .eq('id', existingFeedback.id);

        if (error) throw error;
        toast({ title: "Feedback Updated", description: "Your resonance feedback has been updated." });
      } else {
        // Create new feedback
        const { error } = await supabase
          .from('community_feedback')
          .insert({
            audit_id: auditEntry.id,
            user_id: user.id,
            resonance,
            note: note.trim() || null,
            trust_weight: await calculateUserTrustWeight(user.id)
          });

        if (error) throw error;
        toast({ title: "Feedback Submitted", description: "Thank you for witnessing this action." });
      }

      setNote('');
      onFeedbackSubmitted?.();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const calculateUserTrustWeight = async (userId: string): Promise<number> => {
    const { data } = await supabase.rpc('calculate_trust_weight', { user_id_param: userId });
    return data || 1.0;
  };

  const getResonanceStats = () => {
    const stats = feedback.reduce((acc, f) => {
      acc[f.resonance] += f.trust_weight;
      acc.total += f.trust_weight;
      return acc;
    }, { resonates: 0, neutral: 0, distorts: 0, total: 0 });

    return stats;
  };

  const stats = getResonanceStats();
  const resonanceScore = stats.total > 0 ? 
    (stats.resonates * 1.618 + stats.neutral * 1.0 + stats.distorts * 0.618) / (stats.total * 1.618) : 
    0.5;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Heart className="h-4 w-4 text-primary" />
          Community Witness
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resonance Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Community Resonance</span>
            <Badge variant="outline">{Math.round(resonanceScore * 100)}%</Badge>
          </div>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
            <div 
              className="bg-success transition-all duration-300" 
              style={{ width: `${(stats.resonates / stats.total) * 100 || 0}%` }}
            />
            <div 
              className="bg-warning transition-all duration-300" 
              style={{ width: `${(stats.neutral / stats.total) * 100 || 0}%` }}
            />
            <div 
              className="bg-destructive transition-all duration-300" 
              style={{ width: `${(stats.distorts / stats.total) * 100 || 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(stats.resonates)} resonates</span>
            <span>{Math.round(stats.neutral)} neutral</span>
            <span>{Math.round(stats.distorts)} distorts</span>
          </div>
        </div>

        <Separator />

        {/* Feedback Form */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant={resonance === 'resonates' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setResonance('resonates')}
              className="flex-1"
            >
              <Heart className="h-3 w-3 mr-1" />
              Resonates
            </Button>
            <Button
              variant={resonance === 'neutral' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setResonance('neutral')}
              className="flex-1"
            >
              <Minus className="h-3 w-3 mr-1" />
              Neutral
            </Button>
            <Button
              variant={resonance === 'distorts' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setResonance('distorts')}
              className="flex-1"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Distorts
            </Button>
          </div>

          <Textarea
            placeholder="Optional: Share your perspective on this action's alignment with Sacred Shifter principles..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[60px] text-xs"
            maxLength={500}
          />

          <Button 
            onClick={handleSubmitFeedback} 
            disabled={submitting}
            size="sm"
            className="w-full"
          >
            {submitting ? 'Submitting...' : 'Submit Witness'}
          </Button>
        </div>

        {/* Recent Feedback */}
        {feedback.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <span className="text-xs font-medium">Recent Witness</span>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {feedback.slice(0, 3).map((f) => (
                  <div key={f.id} className="text-xs p-2 rounded bg-muted/50">
                    <div className="flex items-center justify-between mb-1">
                      <Badge 
                        variant={f.resonance === 'resonates' ? 'default' : 
                               f.resonance === 'distorts' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {f.resonance}
                      </Badge>
                      <span className="text-muted-foreground">
                        weight: {f.trust_weight.toFixed(1)}
                      </span>
                    </div>
                    {f.note && <p className="text-muted-foreground">{f.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}