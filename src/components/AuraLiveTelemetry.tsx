import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Radio, 
  Wifi, 
  WifiOff, 
  Activity, 
  Heart,
  Users,
  TreePine,
  BookOpen,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAuraPlatformContext } from '@/contexts/AuraPlatformContext';

interface LiveMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

export const AuraLiveTelemetry: React.FC = () => {
  const { user } = useAuth();
  const { platformState } = useAuraPlatformContext();
  const [isConnected, setIsConnected] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([]);
  const [autoSync, setAutoSync] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Initialize live metrics
  useEffect(() => {
    const initialMetrics: LiveMetric[] = [
      {
        id: 'active_users',
        label: 'Active Users',
        value: platformState.activeUsers,
        change: 0,
        trend: 'stable',
        icon: Users
      },
      {
        id: 'grove_sessions',
        label: 'Grove Sessions',
        value: platformState.groveUsers.length,
        change: 0,
        trend: 'stable',
        icon: TreePine
      },
      {
        id: 'registry_activity',
        label: 'Registry Activity',
        value: platformState.recentRegistryEntries.length,
        change: 0,
        trend: 'stable',
        icon: BookOpen
      },
      {
        id: 'platform_pulse',
        label: 'Platform Pulse',
        value: Math.round(platformState.communityResonance * 100),
        change: 0,
        trend: 'stable',
        icon: Heart
      }
    ];
    
    setLiveMetrics(initialMetrics);
  }, [platformState]);

  // Set up real-time telemetry
  useEffect(() => {
    if (!user || !autoSync) return;

    const setupRealtimeConnection = async () => {
      try {
        // Create a dedicated telemetry channel
        const telemetryChannel = supabase.channel('aura-telemetry')
          .on('presence', { event: 'sync' }, () => {
            setIsConnected(true);
            setLastUpdate(new Date());
          })
          .on('presence', { event: 'join' }, ({ newPresences }) => {
            console.log('New presence joined:', newPresences);
          })
          .on('presence', { event: 'leave' }, ({ leftPresences }) => {
            console.log('Presence left:', leftPresences);
          })
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              // Track our presence for live telemetry
              await telemetryChannel.track({
                user_id: user.id,
                component: 'aura-telemetry',
                online_at: new Date().toISOString(),
                role: 'observer'
              });
              setIsConnected(true);
            }
          });

        // Subscribe to platform events for live updates
        const platformEventsChannel = supabase
          .channel('platform-events')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'akashic_records'
            },
            (payload) => {
              updateLiveMetrics(payload);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(telemetryChannel);
          supabase.removeChannel(platformEventsChannel);
        };

      } catch (error) {
        console.error('Failed to setup real-time telemetry:', error);
        setIsConnected(false);
      }
    };

    setupRealtimeConnection().then(cleanup => {
      return cleanup;
    });
  }, [user, autoSync]);

  // Update metrics based on real-time events
  const updateLiveMetrics = (event: any) => {
    setLastUpdate(new Date());
    
    setLiveMetrics(prev => prev.map(metric => {
      const oldValue = metric.value;
      let newValue = oldValue;
      
      // Update based on event type
      if (event.new?.type === 'platform_activity') {
        const activity = event.new.data as any;
        
        switch (activity?.type) {
          case 'grove_entry':
            if (metric.id === 'grove_sessions') newValue = oldValue + 1;
            break;
          case 'grove_exit':
            if (metric.id === 'grove_sessions') newValue = Math.max(0, oldValue - 1);
            break;
          case 'registry_creation':
            if (metric.id === 'registry_activity') newValue = oldValue + 1;
            break;
          case 'page_navigation':
            if (metric.id === 'active_users') {
              // Estimate active users based on recent navigation
              newValue = Math.max(1, oldValue);
            }
            break;
        }
      }
      
      const change = newValue - oldValue;
      const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
      
      return {
        ...metric,
        value: newValue,
        change,
        trend
      };
    }));
  };

  // Manual refresh
  const refreshMetrics = async () => {
    setLastUpdate(new Date());
    
    try {
      // Get fresh platform data
      const { data: recentActivities } = await supabase
        .from('akashic_records')
        .select('*')
        .eq('type', 'platform_activity')
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      // Update metrics based on recent activities
      if (recentActivities) {
        const groveActivities = recentActivities.filter(a => {
          const data = a.data as any;
          return data?.type?.includes('grove');
        });
        const registryActivities = recentActivities.filter(a => {
          const data = a.data as any;
          return data?.type === 'registry_creation';
        });

        setLiveMetrics(prev => prev.map(metric => {
          switch (metric.id) {
            case 'grove_sessions':
              return { ...metric, value: groveActivities.length };
            case 'registry_activity':
              return { ...metric, value: registryActivities.length };
            case 'active_users':
              const uniqueUsers = new Set(recentActivities.map(a => {
                const data = a.data as any;
                return data?.userId;
              }).filter(Boolean)).size;
              return { ...metric, value: uniqueUsers };
            default:
              return metric;
          }
        }));
      }
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-sacred-emerald';
      case 'down': return 'text-sacred-crimson';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-pulse" />
            <span>Live Telemetry</span>
          </CardTitle>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-sacred-emerald" />
              ) : (
                <WifiOff className="w-4 h-4 text-sacred-crimson" />
              )}
              <Badge variant={isConnected ? 'default' : 'destructive'} className="text-xs">
                {isConnected ? 'Live' : 'Offline'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={autoSync}
                onCheckedChange={setAutoSync}
                className="scale-75"
              />
              <span className="text-xs text-muted-foreground">Auto</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshMetrics}
              className="p-1"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Live Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {liveMetrics.map((metric) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-lg bg-background/30 border border-border/30"
            >
              <div className="flex items-center justify-between mb-1">
                <metric.icon className="w-4 h-4 text-muted-foreground" />
                <span className={`text-xs ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)} {metric.change !== 0 && Math.abs(metric.change)}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-lg font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection Status */}
        <div className="pt-3 border-t border-border/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {isConnected ? 'Streaming live data' : 'Connection interrupted'}
            </span>
            <span>
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        {isConnected && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8"
              onClick={refreshMetrics}
            >
              <Activity className="w-3 h-3 mr-1" />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8"
              onClick={() => {
                // Trigger Aura awareness sync
                console.log('Triggering Aura sync...');
              }}
            >
              <Heart className="w-3 h-3 mr-1" />
              Sync Aura
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};