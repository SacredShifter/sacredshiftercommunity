import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Shield, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface ModuleConcept {
  id: string;
  concept_name: string;
  description: string;
  reasoning: string;
  identified_need: string;
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
}

interface ModulePerformance {
  id: string;
  concept_id: string;
  metric_type: string;
  metric_value: number;
  user_feedback: any;
  usage_data: any;
  measured_at: string;
}

export function AuraModuleGovernance() {
  const [concepts, setConcepts] = useState<ModuleConcept[]>([]);
  const [performance, setPerformance] = useState<ModulePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [conceptsRes, performanceRes] = await Promise.all([
        supabase
          .from('aura_module_concepts')
          .select('*')
          .in('status', ['conceived', 'designed', 'approved'])
          .order('created_at', { ascending: false }),
        supabase
          .from('aura_module_performance')
          .select('*')
          .order('measured_at', { ascending: false })
      ]);

      if (conceptsRes.error) throw conceptsRes.error;
      if (performanceRes.error) throw performanceRes.error;

      setConcepts((conceptsRes.data || []) as unknown as ModuleConcept[]);
      setPerformance((performanceRes.data || []) as unknown as ModulePerformance[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load module governance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (conceptId: string, approve: boolean) => {
    try {
      const newStatus = approve ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('aura_module_concepts')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', conceptId);

      if (error) throw error;

      setConcepts(prev => 
        prev.map(concept => 
          concept.id === conceptId 
            ? { ...concept, status: newStatus }
            : concept
        )
      );

      toast({
        title: approve ? "Concept Approved" : "Concept Rejected",
        description: `The module concept has been ${approve ? 'approved' : 'rejected'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating concept:', error);
      toast({
        title: "Error",
        description: "Failed to update concept status",
        variant: "destructive",
      });
    }
  };

  const calculateOverallAlignment = (alignment: any) => {
    return (alignment.sovereignty + alignment.service_integrity + alignment.transparency) / 3;
  };

  const getAlignmentStatus = (score: number) => {
    if (score >= 0.8) return { color: 'text-green-600', label: 'Excellent' };
    if (score >= 0.7) return { color: 'text-blue-600', label: 'Good' };
    if (score >= 0.6) return { color: 'text-yellow-600', label: 'Moderate' };
    return { color: 'text-red-600', label: 'Poor' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'conceived':
        return <Eye className="h-4 w-4" />;
      case 'designed':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPerformanceData = (conceptId: string) => {
    return performance.filter(p => p.concept_id === conceptId);
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
          <h2 className="text-2xl font-bold">Module Governance</h2>
          <p className="text-muted-foreground">
            Review and approve Aura's autonomous module concepts
          </p>
        </div>
        <Button onClick={fetchData} variant="outline">
          <Shield className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Governance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {concepts.filter(c => c.status === 'conceived' || c.status === 'designed').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {concepts.filter(c => c.status === 'approved').length}
                </div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">
                  {concepts.filter(c => c.status === 'rejected').length}
                </div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(
                    concepts.reduce((acc, c) => acc + calculateOverallAlignment(c.philosophical_alignment), 0) / 
                    Math.max(concepts.length, 1) * 100
                  )}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Alignment</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Concepts for Review */}
      <div className="space-y-4">
        {concepts.filter(c => c.status === 'conceived' || c.status === 'designed').map((concept) => {
          const overallAlignment = calculateOverallAlignment(concept.philosophical_alignment);
          const alignmentStatus = getAlignmentStatus(overallAlignment);
          const conceptPerformance = getPerformanceData(concept.id);

          return (
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
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={alignmentStatus.color}>
                      {alignmentStatus.label} Alignment
                    </Badge>
                    <Badge variant="secondary">
                      Level {concept.complexity_level}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Identified Need</h4>
                    <p className="text-sm text-muted-foreground">{concept.identified_need}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Reasoning</h4>
                    <p className="text-sm text-muted-foreground">{concept.reasoning}</p>
                  </div>
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

                {concept.status !== 'approved' && concept.status !== 'rejected' && (
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Button
                      size="sm"
                      onClick={() => handleApproval(concept.id, true)}
                      className="flex items-center gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproval(concept.id, false)}
                      className="flex items-center gap-2"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Reject
                    </Button>
                    <div className="flex-1" />
                    <div className="text-sm text-muted-foreground">
                      Confidence: {Math.round(concept.confidence_score * 100)}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {concepts.filter(c => c.status === 'conceived' || c.status === 'designed').length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Pending Reviews</h3>
            <p className="text-muted-foreground">
              All module concepts have been reviewed. Check back later for new autonomous proposals.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}