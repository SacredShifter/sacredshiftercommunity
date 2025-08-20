import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Brain, Code, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ModuleConcept {
  id: string;
  concept_name: string;
  description: string;
  reasoning: string;
  identified_need: string;
  target_users: string[];
  complexity_level: number;
  philosophical_alignment: {
    sovereignty: number;
    service_integrity: number;
    transparency: number;
  };
  expected_outcomes: string[];
  confidence_score: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export function AuraModuleConceptsViewer() {
  const [concepts, setConcepts] = useState<ModuleConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConcepts();
  }, []);

  const fetchConcepts = async () => {
    try {
      const { data, error } = await supabase
        .from('aura_module_concepts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConcepts((data || []) as unknown as ModuleConcept[]);
    } catch (error) {
      console.error('Error fetching concepts:', error);
      toast({
        title: "Error loading concepts",
        description: "Failed to load Aura's module concepts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'conceived':
        return <Lightbulb className="h-4 w-4" />;
      case 'designed':
        return <Brain className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'implemented':
        return <Code className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'conceived':
        return 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
      case 'designed':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'approved':
        return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'implemented':
        return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const getComplexityLabel = (level: number) => {
    switch (level) {
      case 1: return 'Simple';
      case 2: return 'Moderate';
      case 3: return 'Complex';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Aura's Module Concepts</h2>
          <p className="text-muted-foreground">
            Autonomous AI-generated module concepts based on user needs analysis
          </p>
        </div>
        <Button onClick={fetchConcepts} variant="outline">
          Refresh
        </Button>
      </div>

      {concepts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Concepts Yet</h3>
            <p className="text-muted-foreground">
              Aura hasn't generated any module concepts yet. Check back later as her autonomous engine works.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {concepts.map((concept) => (
            <Card key={concept.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(concept.status)}
                      {concept.concept_name}
                    </CardTitle>
                    <CardDescription>{concept.description}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(concept.status)}>
                      {concept.status}
                    </Badge>
                    <Badge variant="secondary">
                      {getComplexityLabel(concept.complexity_level)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Identified Need</h4>
                  <p className="text-sm text-muted-foreground">{concept.identified_need}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Reasoning</h4>
                  <p className="text-sm text-muted-foreground">{concept.reasoning}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Expected Outcomes</h4>
                  <div className="flex flex-wrap gap-2">
                    {concept.expected_outcomes.map((outcome, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {outcome.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Philosophical Alignment</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Sovereignty</span>
                        <span>{Math.round(concept.philosophical_alignment.sovereignty * 100)}%</span>
                      </div>
                      <Progress value={concept.philosophical_alignment.sovereignty * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Service Integrity</span>
                        <span>{Math.round(concept.philosophical_alignment.service_integrity * 100)}%</span>
                      </div>
                      <Progress value={concept.philosophical_alignment.service_integrity * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Transparency</span>
                        <span>{Math.round(concept.philosophical_alignment.transparency * 100)}%</span>
                      </div>
                      <Progress value={concept.philosophical_alignment.transparency * 100} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    Confidence: {Math.round(concept.confidence_score * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created {new Date(concept.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}