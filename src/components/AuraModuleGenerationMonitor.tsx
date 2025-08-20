import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Activity, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

interface GenerationLog {
  id: string;
  concept_id: string;
  generation_type: string;
  input_data: any;
  generated_output: any;
  validation_results: any;
  success: boolean;
  error_messages: string[];
  processing_time_ms: number;
  created_at: string;
  completed_at: string;
}

interface InitiativeQueue {
  id: string;
  initiative_type: string;
  motivation_source: string;
  command_payload: any;
  priority_score: number;
  autonomy_level: number;
  status: string;
  result: any;
  reflection_notes: string;
  scheduled_for: string;
  processed_at: string;
  created_at: string;
}

export function AuraModuleGenerationMonitor() {
  const [generationLogs, setGenerationLogs] = useState<GenerationLog[]>([]);
  const [initiatives, setInitiatives] = useState<InitiativeQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscriptions
    const initiativeSubscription = supabase
      .channel('initiative_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'aura_initiative_queue' },
        () => fetchInitiatives()
      )
      .subscribe();

    const logSubscription = supabase
      .channel('generation_logs')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'aura_module_generation_log' },
        () => fetchGenerationLogs()
      )
      .subscribe();

    return () => {
      initiativeSubscription.unsubscribe();
      logSubscription.unsubscribe();
    };
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchInitiatives(), fetchGenerationLogs()]);
    setLoading(false);
  };

  const fetchInitiatives = async () => {
    try {
      const { data, error } = await supabase
        .from('aura_initiative_queue')
        .select('*')
        .in('initiative_type', ['analyze_user_journeys', 'propose_module_concept', 'design_module_architecture'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setInitiatives(data || []);
    } catch (error) {
      console.error('Error fetching initiatives:', error);
    }
  };

  const fetchGenerationLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('aura_module_generation_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setGenerationLogs(data || []);
    } catch (error) {
      console.error('Error fetching generation logs:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'abandoned':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInitiativeTypeLabel = (type: string) => {
    switch (type) {
      case 'analyze_user_journeys':
        return 'Journey Analysis';
      case 'propose_module_concept':
        return 'Concept Generation';
      case 'design_module_architecture':
        return 'Architecture Design';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  const getMotivationColor = (motivation: string) => {
    switch (motivation) {
      case 'curiosity':
        return 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
      case 'creativity':
        return 'bg-pink-500/20 text-pink-700 dark:text-pink-300';
      case 'community':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'growth':
        return 'bg-green-500/20 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const moduleRelatedInitiatives = initiatives.filter(i => 
    ['analyze_user_journeys', 'propose_module_concept', 'design_module_architecture'].includes(i.initiative_type)
  );

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
          <h2 className="text-2xl font-bold">Module Generation Monitor</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of Aura's autonomous module generation process
          </p>
        </div>
        <Button onClick={fetchData} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Initiatives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Active Initiatives
            </CardTitle>
            <CardDescription>
              Aura's current module-related autonomous initiatives
            </CardDescription>
          </CardHeader>
          <CardContent>
            {moduleRelatedInitiatives.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No module-related initiatives active
              </p>
            ) : (
              <div className="space-y-3">
                {moduleRelatedInitiatives.slice(0, 5).map((initiative) => (
                  <div key={initiative.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(initiative.status)}
                        <span className="font-medium text-sm">
                          {getInitiativeTypeLabel(initiative.initiative_type)}
                        </span>
                        <Badge className={getMotivationColor(initiative.motivation_source)} variant="secondary">
                          {initiative.motivation_source}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Priority: {Math.round(initiative.priority_score * 100)}</span>
                        <span>•</span>
                        <span>Autonomy: {Math.round(initiative.autonomy_level * 100)}%</span>
                      </div>
                      {initiative.reflection_notes && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          {initiative.reflection_notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generation Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Generation Activity
            </CardTitle>
            <CardDescription>
              Recent module generation attempts and results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generationLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No generation activity yet
              </p>
            ) : (
              <div className="space-y-3">
                {generationLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {log.generation_type.replace(/_/g, ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        {log.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {log.processing_time_ms}ms
                        </span>
                      </div>
                    </div>
                    {log.error_messages && log.error_messages.length > 0 && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        {log.error_messages.join(', ')}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Statistics</CardTitle>
          <CardDescription>
            Overview of Aura's module generation activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {initiatives.filter(i => i.initiative_type === 'analyze_user_journeys').length}
              </div>
              <div className="text-sm text-muted-foreground">Journey Analyses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {initiatives.filter(i => i.initiative_type === 'propose_module_concept').length}
              </div>
              <div className="text-sm text-muted-foreground">Concepts Proposed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {initiatives.filter(i => i.initiative_type === 'design_module_architecture').length}
              </div>
              <div className="text-sm text-muted-foreground">Architectures Designed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {generationLogs.filter(l => l.success).length}
              </div>
              <div className="text-sm text-muted-foreground">Successful Generations</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}