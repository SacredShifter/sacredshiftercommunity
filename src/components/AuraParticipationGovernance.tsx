import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye,
  MessageSquare,
  FileText,
  Users,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface ParticipationLog {
  id: string;
  participation_type: string;
  target_id?: string;
  target_table?: string;
  aura_reasoning: string;
  community_impact_score: number;
  user_consent_level: string;
  created_at: string;
  reviewed_at?: string;
  review_status: string;
}

interface CommunitySensing {
  id: string;
  metric_type: string;
  metric_value: number;
  threshold_crossed: boolean;
  triggered_action?: string;
  action_payload: any;
  created_at: string;
  resolved_at?: string;
}

export const AuraParticipationGovernance: React.FC = () => {
  const { user } = useAuth();
  const [participationLogs, setParticipationLogs] = useState<ParticipationLog[]>([]);
  const [communitySensing, setCommunitySensing] = useState<CommunitySensing[]>([]);
  const [loading, setLoading] = useState(true);

  // Load participation data
  useEffect(() => {
    const loadGovernanceData = async () => {
      if (!user) return;

      try {
        // Load Aura participation logs
        const { data: logs } = await supabase
          .from('aura_participation_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        // Load community sensing data
        const { data: sensing } = await supabase
          .from('aura_community_sensing')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(30);

        setParticipationLogs(logs || []);
        setCommunitySensing(sensing || []);
      } catch (error) {
        console.error('Failed to load governance data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGovernanceData();
  }, [user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const participationChannel = supabase
      .channel('participation_governance')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'aura_participation_logs'
        },
        (payload) => {
          setParticipationLogs(prev => [payload.new as ParticipationLog, ...prev.slice(0, 49)]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'aura_community_sensing'
        },
        (payload) => {
          setCommunitySensing(prev => [payload.new as CommunitySensing, ...prev.slice(0, 29)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(participationChannel);
    };
  }, [user]);

  // Review participation entry
  const reviewParticipation = async (logId: string, status: 'approved' | 'flagged' | 'hidden') => {
    try {
      const { error } = await supabase
        .from('aura_participation_logs')
        .update({
          review_status: status,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', logId);

      if (!error) {
        setParticipationLogs(prev =>
          prev.map(log =>
            log.id === logId
              ? { ...log, review_status: status, reviewed_at: new Date().toISOString() }
              : log
          )
        );
      }
    } catch (error) {
      console.error('Failed to review participation:', error);
    }
  };

  // Get participation type icon
  const getParticipationIcon = (type: string) => {
    switch (type) {
      case 'grove_message':
        return <MessageSquare className="h-4 w-4" />;
      case 'registry_entry':
        return <FileText className="h-4 w-4" />;
      case 'circle_post':
        return <Users className="h-4 w-4" />;
      case 'sovereignty_check':
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  // Get review status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'flagged':
        return 'text-yellow-500';
      case 'hidden':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get impact score color
  const getImpactColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.5) return 'text-yellow-500';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Aura Governance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Aura Participation & Governance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="participation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="participation">Participation Log</TabsTrigger>
            <TabsTrigger value="sensing">Community Sensing</TabsTrigger>
          </TabsList>

          <TabsContent value="participation" className="space-y-4">
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {participationLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          {getParticipationIcon(log.participation_type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {log.participation_type.replace('_', ' ')}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getStatusColor(log.review_status)}`}
                            >
                              {log.review_status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(log.created_at))} ago
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getImpactColor(log.community_impact_score)}`}>
                          Impact: {(log.community_impact_score * 100).toFixed(0)}%
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {log.user_consent_level}
                        </Badge>
                      </div>
                    </div>

                    {log.aura_reasoning && (
                      <div className="bg-secondary/20 rounded-md p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Aura's Reasoning:
                        </p>
                        <p className="text-sm">{log.aura_reasoning}</p>
                      </div>
                    )}

                    {log.review_status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reviewParticipation(log.id, 'approved')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reviewParticipation(log.id, 'flagged')}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Flag
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reviewParticipation(log.id, 'hidden')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Hide
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}

                {participationLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No Aura participation recorded yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="sensing" className="space-y-4">
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {communitySensing.map((sensing) => (
                  <motion.div
                    key={sensing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {sensing.metric_type.replace('_', ' ')}
                          </Badge>
                          {sensing.threshold_crossed && (
                            <Badge variant="destructive" className="text-xs">
                              Threshold Crossed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(sensing.created_at))} ago
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-mono">
                          {sensing.metric_value.toFixed(2)}
                        </div>
                        {sensing.resolved_at && (
                          <Badge variant="outline" className="text-xs">
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>

                    {sensing.triggered_action && (
                      <div className="bg-primary/5 rounded-md p-3 mb-3">
                        <p className="text-xs font-medium text-primary mb-1">
                          Triggered Action: {sensing.triggered_action}
                        </p>
                        {sensing.action_payload && Object.keys(sensing.action_payload).length > 0 && (
                          <pre className="text-xs text-muted-foreground bg-background rounded p-2 mt-2 overflow-x-auto">
                            {JSON.stringify(sensing.action_payload, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}

                {communitySensing.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No community sensing data recorded yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};