import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';

interface PlatformActivity {
  type: 'grove_entry' | 'grove_exit' | 'registry_creation' | 'circle_activity' | 'journal_entry' | 'page_navigation';
  userId?: string;
  data: any;
  timestamp: string;
  location?: string;
}

interface PlatformState {
  activeUsers: number;
  currentActivities: PlatformActivity[];
  groveUsers: Array<{ userId: string; component: string; timestamp: string }>;
  recentRegistryEntries: any[];
  circleActivities: any[];
  communityResonance: number;
  platformHealth: {
    activeConnections: number;
    systemLoad: number;
    lastUpdate: string;
  };
}

interface AuraPlatformContextType {
  platformState: PlatformState;
  recordActivity: (activity: Omit<PlatformActivity, 'timestamp'>) => void;
  getAuraContext: () => any;
  isAuraAware: boolean;
  auraPresenceLocations: string[];
}

const defaultPlatformState: PlatformState = {
  activeUsers: 0,
  currentActivities: [],
  groveUsers: [],
  recentRegistryEntries: [],
  circleActivities: [],
  communityResonance: 0.5,
  platformHealth: {
    activeConnections: 0,
    systemLoad: 0,
    lastUpdate: new Date().toISOString()
  }
};

const AuraPlatformContext = createContext<AuraPlatformContextType | undefined>(undefined);

export const AuraPlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [platformState, setPlatformState] = useState<PlatformState>(defaultPlatformState);
  const [isAuraAware, setIsAuraAware] = useState(true);
  const [auraPresenceLocations, setAuraPresenceLocations] = useState<string[]>([]);

  // Track user's current location for Aura awareness
  useEffect(() => {
    if (user && location.pathname) {
      recordActivity({
        type: 'page_navigation',
        userId: user.id,
        data: { 
          path: location.pathname,
          pathname: location.pathname,
          search: location.search 
        },
        location: location.pathname
      });

      // Update Aura's presence locations
      setAuraPresenceLocations(prev => {
        const newLocations = [...prev];
        if (!newLocations.includes(location.pathname)) {
          newLocations.push(location.pathname);
          // Keep only last 5 locations
          return newLocations.slice(-5);
        }
        return newLocations;
      });
    }
  }, [location.pathname, user]);

  // Real-time subscription to platform activities
  useEffect(() => {
    if (!user) return;

    // Subscribe to active user metrics
    const userMetricsChannel = supabase
      .channel('user-metrics-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'active_user_metrics' 
        },
        (payload) => {
          setPlatformState(prev => ({
            ...prev,
            activeUsers: prev.activeUsers + (payload.eventType === 'INSERT' ? 1 : 0),
            platformHealth: {
              ...prev.platformHealth,
              activeConnections: prev.platformHealth.activeConnections + 1,
              lastUpdate: new Date().toISOString()
            }
          }));
        }
      )
      .subscribe();

    // Subscribe to registry entries
    const registryChannel = supabase
      .channel('registry-changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'registry_of_resonance' 
        },
        (payload) => {
          recordActivity({
            type: 'registry_creation',
            userId: payload.new.user_id,
            data: payload.new
          });
        }
      )
      .subscribe();

    // Subscribe to Grove interactions
    const groveChannel = supabase
      .channel('grove-interactions')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'aura_grove_interactions' 
        },
        (payload) => {
          recordActivity({
            type: payload.new.interaction_type === 'entry' ? 'grove_entry' : 'grove_exit',
            userId: payload.new.user_id,
            data: payload.new
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userMetricsChannel);
      supabase.removeChannel(registryChannel);
      supabase.removeChannel(groveChannel);
    };
  }, [user]);

  // Load initial platform state
  useEffect(() => {
    loadPlatformState();
  }, []);

  const loadPlatformState = async () => {
    try {
      // Get active users count
      const { count: activeUsersCount } = await supabase
        .from('active_user_metrics')
        .select('*', { count: 'exact', head: true })
        .gte('last_active_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()); // Last 30 minutes

      // Get recent registry entries
      const { data: registryEntries } = await supabase
        .from('registry_of_resonance')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Get current Grove users
      const { data: groveUsers } = await supabase
        .from('aura_grove_interactions')
        .select('user_id, grove_component, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      // Calculate community resonance (simplified)
      const { data: resonanceData } = await supabase
        .from('auric_resonance')
        .select('resonance_score')
        .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

      const avgResonance = resonanceData?.length 
        ? resonanceData.reduce((sum, r) => sum + r.resonance_score, 0) / resonanceData.length
        : 0.5;

      setPlatformState({
        activeUsers: activeUsersCount || 0,
        currentActivities: [],
        groveUsers: groveUsers?.map(gu => ({
          userId: gu.user_id,
          component: gu.grove_component,
          timestamp: gu.created_at
        })) || [],
        recentRegistryEntries: registryEntries || [],
        circleActivities: [],
        communityResonance: avgResonance,
        platformHealth: {
          activeConnections: activeUsersCount || 0,
          systemLoad: Math.random() * 0.3 + 0.1, // Simulated
          lastUpdate: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error loading platform state:', error);
    }
  };

  const recordActivity = useCallback((activity: Omit<PlatformActivity, 'timestamp'>) => {
    const newActivity: PlatformActivity = {
      ...activity,
      timestamp: new Date().toISOString()
    };

    setPlatformState(prev => ({
      ...prev,
      currentActivities: [newActivity, ...prev.currentActivities.slice(0, 49)] // Keep last 50 activities
    }));

    // Store activity for Aura's long-term awareness
    if (user) {
      supabase
        .from('akashic_records')
        .insert({
          type: 'platform_activity',
          data: newActivity as any,
          session_id: `platform_${user.id}`,
          metadata: {
            aura_visibility: true,
            activity_type: activity.type,
            user_id: activity.userId
          } as any
        })
        .then(({ error }) => {
          if (error) console.error('Error storing platform activity:', error);
        });
    }
  }, [user]);

  const getAuraContext = useCallback(() => {
    return {
      platform_state: platformState,
      current_user: user ? {
        id: user.id,
        location: location.pathname,
        recent_activities: platformState.currentActivities
          .filter(a => a.userId === user.id)
          .slice(0, 5)
      } : null,
      community_pulse: {
        active_users: platformState.activeUsers,
        grove_engagement: platformState.groveUsers.length,
        registry_activity: platformState.recentRegistryEntries.length,
        resonance_level: platformState.communityResonance
      },
      grove_awareness: {
        current_users: platformState.groveUsers,
        recent_interactions: platformState.currentActivities
          .filter(a => a.type.includes('grove'))
          .slice(0, 10)
      },
      system_health: platformState.platformHealth,
      aura_presence: {
        aware_locations: auraPresenceLocations,
        active_monitoring: isAuraAware,
        last_sync: new Date().toISOString()
      }
    };
  }, [platformState, location.pathname, user, auraPresenceLocations, isAuraAware]);

  return (
    <AuraPlatformContext.Provider value={{
      platformState,
      recordActivity,
      getAuraContext,
      isAuraAware,
      auraPresenceLocations
    }}>
      {children}
    </AuraPlatformContext.Provider>
  );
};

export const useAuraPlatformContext = () => {
  const context = useContext(AuraPlatformContext);
  if (context === undefined) {
    throw new Error('useAuraPlatformContext must be used within an AuraPlatformProvider');
  }
  return context;
};
