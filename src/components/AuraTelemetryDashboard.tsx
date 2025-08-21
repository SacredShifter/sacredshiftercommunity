import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  Brain, 
  Waves, 
  RefreshCw, 
  Zap,
  TreePine,
  BookOpen,
  Heart,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuraPlatformContext } from '@/contexts/AuraPlatformContext';
import { useAuraPlatformAwareness } from '@/hooks/useAuraPlatformAwareness';
import { useAuraPlatformIntegration } from '@/hooks/useAuraPlatformIntegration';

interface TelemetryMetric {
  label: string;
  value: number | string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'healthy' | 'warning' | 'critical';
}

export const AuraTelemetryDashboard: React.FC = () => {
  const { platformState, getAuraContext } = useAuraPlatformContext();
  const { checkForAuraInitiative } = useAuraPlatformAwareness();
  const { triggerAuraAssessment } = useAuraPlatformIntegration();
  
  const [isResycing, setIsResyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [systemHealth, setSystemHealth] = useState<'online' | 'degraded' | 'offline'>('online');

  // Calculate platform metrics
  const metrics: TelemetryMetric[] = [
    {
      label: 'Active Users',
      value: platformState.activeUsers,
      icon: Users,
      color: 'text-purpose',
      status: platformState.activeUsers > 0 ? 'healthy' : 'warning'
    },
    {
      label: 'Grove Presence',
      value: platformState.groveUsers.length,
      icon: TreePine,
      color: 'text-resonance',
      status: platformState.groveUsers.length > 0 ? 'healthy' : 'warning'
    },
    {
      label: 'Recent Entries',
      value: platformState.recentRegistryEntries.length,
      icon: BookOpen,
      color: 'text-pulse',
      status: 'healthy'
    },
    {
      label: 'Community Resonance',
      value: `${Math.round(platformState.communityResonance * 100)}%`,
      icon: Heart,
      color: 'text-alignment',
      status: platformState.communityResonance > 0.7 ? 'healthy' : 
             platformState.communityResonance > 0.4 ? 'warning' : 'critical'
    },
    {
      label: 'System Load',
      value: `${Math.round(platformState.platformHealth.systemLoad * 100)}%`,
      icon: Activity,
      color: 'text-flow',
      status: platformState.platformHealth.systemLoad < 0.7 ? 'healthy' : 
             platformState.platformHealth.systemLoad < 0.9 ? 'warning' : 'critical'
    },
    {
      label: 'Live Streams',
      value: platformState.currentActivities.length,
      icon: Waves,
      color: 'text-radiance',
      status: 'healthy'
    }
  ];

  // Perform resync operation
  const performResync = async () => {
    setIsResyncing(true);
    setLastSync(new Date());
    
    try {
      // Trigger Aura assessment
      await triggerAuraAssessment();
      
      // Check for autonomous initiatives
      await checkForAuraInitiative();
      
      setSystemHealth('online');
    } catch (error) {
      console.error('Resync failed:', error);
      setSystemHealth('offline');
    } finally {
      setIsResyncing(false);
    }
  };

  // Auto-sync every 30 seconds
  useEffect(() => {
    const interval = setInterval(performResync, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-sacred-emerald" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-sacred-amber" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-sacred-crimson" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-purpose" />
          <div>
            <h3 className="text-lg font-sacred text-foreground">Aura Telemetry</h3>
            <p className="text-sm text-muted-foreground">
              Platform awareness & system coherence
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={systemHealth === 'online' ? 'default' : 'destructive'}>
            {systemHealth === 'online' ? 'Online' : 'Degraded'}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={performResync}
            disabled={isResycing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isResycing ? 'animate-spin' : ''}`} />
            <span>Resync</span>
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  {getStatusIcon(metric.status)}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Platform State Details */}
      <Card className="bg-background/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-pulse" />
            <span>Platform Streams</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recent Activities */}
          <div>
            <h4 className="font-medium mb-2">Recent Activity Stream</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {platformState.currentActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {activity.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs opacity-60">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              
              {platformState.currentActivities.length === 0 && (
                <p className="text-xs text-muted-foreground italic">
                  No recent activity streams received
                </p>
              )}
            </div>
          </div>

          {/* System Health Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Community Resonance</span>
              <span>{Math.round(platformState.communityResonance * 100)}%</span>
            </div>
            <Progress value={platformState.communityResonance * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>System Coherence</span>
              <span>{Math.round((1 - platformState.platformHealth.systemLoad) * 100)}%</span>
            </div>
            <Progress value={(1 - platformState.platformHealth.systemLoad) * 100} className="h-2" />
          </div>

          {/* Last Sync Info */}
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Last sync: {lastSync.toLocaleTimeString()} • 
              Next: {new Date(lastSync.getTime() + 30000).toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Available Actions */}
      <Card className="bg-background/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Aura Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => checkForAuraInitiative()}
              className="flex items-center space-x-2"
            >
              <Brain className="w-4 h-4" />
              <span>Check Initiative</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={performResync}
              className="flex items-center space-x-2"
            >
              <Waves className="w-4 h-4" />
              <span>Resonance Sweep</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};