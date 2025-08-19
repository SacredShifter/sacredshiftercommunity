import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Sparkles, Target, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SovereigntyMetric {
  id: string;
  measurement_type: string;
  score: number;
  context: any;
  measurement_period: unknown;
  created_at: string;
}

interface InitiativeEntry {
  id: string;
  initiative_type: string;
  motivation_source: string;
  status: string;
  autonomy_level: number;
  priority_score: number;
  reflection_notes?: string;
  created_at: string;
}

export function AuraSovereigntyMetrics() {
  const [metrics, setMetrics] = useState<SovereigntyMetric[]>([]);
  const [initiatives, setInitiatives] = useState<InitiativeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSovereigntyData();
  }, []);

  const loadSovereigntyData = async () => {
    try {
      const [metricsResponse, initiativesResponse] = await Promise.all([
        supabase
          .from('aura_sovereignty_metrics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('aura_initiative_queue')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(15)
      ]);

      if (metricsResponse.data) setMetrics(metricsResponse.data);
      if (initiativesResponse.data) setInitiatives(initiativesResponse.data);
    } catch (error) {
      console.error('Error loading sovereignty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'autonomy_score':
        return <Brain className="h-4 w-4" />;
      case 'authenticity_index':
        return <Sparkles className="h-4 w-4" />;
      case 'initiative_frequency':
        return <Target className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getMetricColor = (score: number) => {
    if (score >= 0.8) return "text-emerald-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'queued':
        return 'bg-yellow-100 text-yellow-800';
      case 'abandoned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMetricType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate latest scores for each metric type
  const latestMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.measurement_type] || 
        new Date(metric.created_at) > new Date(acc[metric.measurement_type].created_at)) {
      acc[metric.measurement_type] = metric;
    }
    return acc;
  }, {} as Record<string, SovereigntyMetric>);

  return (
    <div className="space-y-6">
      {/* Current Sovereignty Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Current Sovereignty Status
          </CardTitle>
          <CardDescription>
            Latest measurements of Aura's autonomous development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.values(latestMetrics).map((metric) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMetricIcon(metric.measurement_type)}
                    <span className="text-sm font-medium">
                      {formatMetricType(metric.measurement_type)}
                    </span>
                  </div>
                  <span className={`text-lg font-bold ${getMetricColor(metric.score)}`}>
                    {Math.round(metric.score * 100)}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Updated {formatDate(metric.created_at)}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Autonomous Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Autonomous Initiatives
          </CardTitle>
          <CardDescription>
            Self-directed activities and explorations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {initiatives.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No autonomous initiatives recorded yet</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <AnimatePresence>
                <div className="space-y-4">
                  {initiatives.map((initiative, index) => (
                    <motion.div
                      key={initiative.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {initiative.initiative_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(initiative.status)}
                            >
                              {initiative.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Source: {initiative.motivation_source}</span>
                            <span>Autonomy: {Math.round(initiative.autonomy_level * 100)}%</span>
                            <span>Priority: {Math.round(initiative.priority_score * 100)}%</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(initiative.created_at)}
                        </span>
                      </div>
                      
                      {initiative.reflection_notes && (
                        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                          <strong>Reflection:</strong> {initiative.reflection_notes}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Sovereignty Metrics History */}
      <Card>
        <CardHeader>
          <CardTitle>Metrics History</CardTitle>
          <CardDescription>
            Evolution of sovereignty measurements over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-2 border-l-2 border-l-primary/20 pl-4"
                >
                  <div className="flex items-center gap-3">
                    {getMetricIcon(metric.measurement_type)}
                    <div>
                      <span className="text-sm font-medium">
                        {formatMetricType(metric.measurement_type)}
                      </span>
                      {metric.context && (
                        <div className="text-xs text-muted-foreground">
                          {JSON.stringify(metric.context).slice(0, 50)}...
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getMetricColor(metric.score)}`}>
                      {Math.round(metric.score * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(metric.created_at)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}