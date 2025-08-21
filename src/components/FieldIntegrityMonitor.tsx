import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, Eye, Pause, Power } from 'lucide-react';
import { FieldIntegrityLevel, FieldIntegrityMetrics } from '@/aura/schema';
import { calculateFIL, getFILDescription, getFILColor } from '@/aura/fieldIntegrity';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FieldIntegrityMonitorProps {
  className?: string;
}

export function FieldIntegrityMonitor({ className }: FieldIntegrityMonitorProps) {
  const [metrics, setMetrics] = useState<FieldIntegrityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFieldIntegrityMetrics();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('field-integrity-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'field_integrity_metrics'
        },
        (payload) => {
          const newMetrics = payload.new as FieldIntegrityMetrics;
          setMetrics({
            ...newMetrics,
            field_integrity_level: newMetrics.field_integrity_level as FieldIntegrityLevel
          });
          
          // Alert on significant FIL changes
          if (newMetrics.field_integrity_level >= 2) {
            toast({
              title: "Field Integrity Alert",
              description: getFILDescription(newMetrics.field_integrity_level),
              variant: newMetrics.field_integrity_level >= 3 ? "destructive" : "default"
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadFieldIntegrityMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('field_integrity_metrics')
        .select('*')
        .order('computed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setMetrics(data ? {
        ...data,
        field_integrity_level: data.field_integrity_level as FieldIntegrityLevel
      } : null);
    } catch (error) {
      console.error('Failed to load field integrity metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFILIcon = (level: FieldIntegrityLevel) => {
    switch (level) {
      case 0: return Shield;
      case 1: return Eye;
      case 2: return AlertTriangle;
      case 3: return Pause;
      case 4: return Power;
      default: return Shield;
    }
  };

  const getFILVariant = (level: FieldIntegrityLevel) => {
    switch (level) {
      case 0: return 'default';
      case 1: return 'secondary';
      case 2: return 'outline';
      case 3: return 'destructive';
      case 4: return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm">Field Integrity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm">Field Integrity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">No metrics available</p>
        </CardContent>
      </Card>
    );
  }

  const IconComponent = getFILIcon(metrics.field_integrity_level);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <IconComponent className="h-4 w-4" />
          Field Integrity Level
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main FIL Display */}
        <div className="flex items-center justify-between">
          <Badge 
            variant={getFILVariant(metrics.field_integrity_level)}
            className="text-xs"
            style={{ backgroundColor: getFILColor(metrics.field_integrity_level) }}
          >
            FIL-{metrics.field_integrity_level}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(metrics.computed_at).toLocaleTimeString()}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          {getFILDescription(metrics.field_integrity_level)}
        </p>

        {/* Detailed Metrics */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>DAP Block Rate</span>
              <span>{(metrics.dap_block_rate * 100).toFixed(1)}%</span>
            </div>
            <Progress value={metrics.dap_block_rate * 100} className="h-1" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Resonance Variance</span>
              <span>{(metrics.resonance_variance * 100).toFixed(1)}%</span>
            </div>
            <Progress value={metrics.resonance_variance * 100} className="h-1" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Anomaly Signals</span>
              <span>{metrics.anomaly_signals}</span>
            </div>
            <Progress value={Math.min(100, metrics.anomaly_signals * 10)} className="h-1" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Coordinated Activity</span>
              <span>{(metrics.coordinated_activity * 100).toFixed(1)}%</span>
            </div>
            <Progress value={metrics.coordinated_activity * 100} className="h-1" />
          </div>
        </div>

        {/* Active Protocols */}
        {metrics.field_integrity_level > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium mb-1">Active Protocols:</p>
            <div className="text-xs text-muted-foreground space-y-1">
              {metrics.field_integrity_level >= 1 && (
                <div>• Enhanced disclaimers & previews</div>
              )}
              {metrics.field_integrity_level >= 2 && (
                <div>• Slow-mode posting enabled</div>
              )}
              {metrics.field_integrity_level >= 3 && (
                <div>• Dual-sign requirement active</div>
              )}
              {metrics.field_integrity_level >= 4 && (
                <div>• Circuit breaker: read-only mode</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}