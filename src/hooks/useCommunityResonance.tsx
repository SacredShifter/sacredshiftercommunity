import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ResonanceField {
  id: string;
  type: 'meditation' | 'discussion' | 'creation' | 'exploration';
  participants: string[];
  currentResonance: number;
  peakResonance: number;
  duration: number;
  startedAt: string;
  endedAt?: string;
  emergentProperties: string[];
  collectiveInsights: string[];
}

interface ResonanceParticipant {
  userId: string;
  joinedAt: string;
  contributionScore: number;
  resonanceLevel: number;
  lastActive: string;
}

interface CommunityResonanceState {
  globalResonance: number;
  activeFields: ResonanceField[];
  personalContribution: number;
  harmonicFrequency: number;
  fieldStability: number;
  emergentPatterns: string[];
}

export function useCommunityResonance() {
  const { user } = useAuth();
  const [resonanceState, setResonanceState] = useState<CommunityResonanceState>({
    globalResonance: 0.5,
    activeFields: [],
    personalContribution: 0,
    harmonicFrequency: 432, // Hz
    fieldStability: 0.8,
    emergentPatterns: []
  });
  const [isConnected, setIsConnected] = useState(false);
  const [activeSession, setActiveSession] = useState<ResonanceField | null>(null);

  // Connect to real-time resonance updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('community-resonance')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'akashic_records',
        filter: `type=eq.community_resonance`
      }, (payload) => {
        handleResonanceUpdate(payload);
      })
      .subscribe();

    setIsConnected(true);

    // Load initial state
    loadResonanceState();

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [user]);

  const loadResonanceState = async () => {
    try {
      // Get recent resonance data
      const { data: resonanceData, error } = await supabase
        .from('akashic_records')
        .select('*')
        .eq('type', 'community_resonance')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (resonanceData && resonanceData.length > 0) {
        const latest = resonanceData[0].data;
        if (latest && typeof latest === 'object' && !Array.isArray(latest)) {
          setResonanceState(prev => ({
            ...prev,
            ...latest as Partial<CommunityResonanceState>
          }));
        }
      }

      // Get active fields
      await loadActiveFields();
    } catch (error) {
      console.error('Error loading resonance state:', error);
    }
  };

  const loadActiveFields = async () => {
    try {
      const { data: fieldsData, error } = await supabase
        .from('akashic_records')
        .select('*')
        .eq('type', 'resonance_field')
        .is('data->>endedAt', null)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const fields = fieldsData?.map(f => f.data as unknown as ResonanceField) || [];
      setResonanceState(prev => ({
        ...prev,
        activeFields: fields
      }));
    } catch (error) {
      console.error('Error loading active fields:', error);
    }
  };

  const handleResonanceUpdate = (payload: any) => {
    const { eventType, new: newRecord } = payload;
    
    if (newRecord?.type === 'community_resonance') {
      setResonanceState(prev => ({
        ...prev,
        ...newRecord.data
      }));
    } else if (newRecord?.type === 'resonance_field') {
      setResonanceState(prev => ({
        ...prev,
        activeFields: prev.activeFields.map(field => 
          field.id === newRecord.data.id ? newRecord.data : field
        )
      }));
    }
  };

  const createResonanceField = useCallback(async (
    type: ResonanceField['type'], 
    initialParticipants: string[] = []
  ): Promise<ResonanceField> => {
    if (!user) throw new Error('User not authenticated');

    const newField: ResonanceField = {
      id: `field-${Date.now()}`,
      type,
      participants: [user.id, ...initialParticipants],
      currentResonance: 0.6,
      peakResonance: 0.6,
      duration: 0,
      startedAt: new Date().toISOString(),
      emergentProperties: [],
      collectiveInsights: []
    };

      // Store in database
      await supabase.from('akashic_records').insert({
        type: 'resonance_field',
        data: newField as any,
        metadata: {
          createdBy: user.id,
          fieldType: type
        } as any
      });

    setActiveSession(newField);
    return newField;
  }, [user]);

  const joinResonanceField = useCallback(async (fieldId: string) => {
    if (!user) return;

    try {
      // Get current field
      const { data, error } = await supabase
        .from('akashic_records')
        .select('*')
        .eq('type', 'resonance_field')
        .eq('data->>id', fieldId)
        .single();

      if (error) throw error;

      const field = data.data as any as ResonanceField;
      
      // Add user to participants if not already present
      if (!field.participants.includes(user.id)) {
        field.participants.push(user.id);
        
        // Update resonance based on new participant
        field.currentResonance = Math.min(1, field.currentResonance + 0.1);
        field.peakResonance = Math.max(field.peakResonance, field.currentResonance);

        // Update in database
        await supabase
          .from('akashic_records')
          .update({ data: field as any })
          .eq('id', data.id);

        setActiveSession(field);
      }
    } catch (error) {
      console.error('Error joining resonance field:', error);
    }
  }, [user]);

  const leaveResonanceField = useCallback(async () => {
    if (!user || !activeSession) return;

    try {
      const updatedField = {
        ...activeSession,
        participants: activeSession.participants.filter(p => p !== user.id)
      };

      // Adjust resonance for departure
      updatedField.currentResonance = Math.max(0.2, updatedField.currentResonance - 0.05);

      // End field if no participants remain
      if (updatedField.participants.length === 0) {
        updatedField.endedAt = new Date().toISOString();
        updatedField.duration = Date.now() - new Date(updatedField.startedAt).getTime();
      }

      // Update in database
      await supabase
        .from('akashic_records')
        .update({ data: updatedField })
        .eq('data->>id', activeSession.id);

      setActiveSession(null);
    } catch (error) {
      console.error('Error leaving resonance field:', error);
    }
  }, [user, activeSession]);

  const contributeToField = useCallback(async (
    contribution: string, 
    contributionType: 'insight' | 'energy' | 'pattern'
  ) => {
    if (!user || !activeSession) return;

    try {
      const updatedField = { ...activeSession };

      // Add contribution
      if (contributionType === 'insight') {
        updatedField.collectiveInsights.push(contribution);
      } else if (contributionType === 'pattern') {
        updatedField.emergentProperties.push(contribution);
      }

      // Boost resonance for meaningful contribution
      updatedField.currentResonance = Math.min(1, updatedField.currentResonance + 0.15);
      updatedField.peakResonance = Math.max(updatedField.peakResonance, updatedField.currentResonance);

      // Update in database
      await supabase
        .from('akashic_records')
        .update({ data: updatedField })
        .eq('data->>id', activeSession.id);

      setActiveSession(updatedField);

      // Update global resonance
      updateGlobalResonance();
    } catch (error) {
      console.error('Error contributing to field:', error);
    }
  }, [user, activeSession]);

  const updateGlobalResonance = useCallback(async () => {
    try {
      // Calculate global resonance from active fields
      const totalResonance = resonanceState.activeFields.reduce(
        (sum, field) => sum + field.currentResonance, 0
      );
      const avgResonance = resonanceState.activeFields.length > 0 
        ? totalResonance / resonanceState.activeFields.length 
        : 0.5;

      // Calculate harmonic frequency based on collective state
      const harmonicFrequency = 432 + (avgResonance * 96); // 432-528 Hz range

      // Calculate field stability
      const resonanceVariance = resonanceState.activeFields.reduce((variance, field) => {
        return variance + Math.pow(field.currentResonance - avgResonance, 2);
      }, 0) / Math.max(1, resonanceState.activeFields.length);
      
      const fieldStability = Math.max(0, 1 - resonanceVariance);

      const newState = {
        ...resonanceState,
        globalResonance: avgResonance,
        harmonicFrequency,
        fieldStability,
        personalContribution: user ? calculatePersonalContribution() : 0
      };

      setResonanceState(newState);

      // Store updated state
      await supabase.from('akashic_records').insert({
        type: 'community_resonance',
        data: newState as any,
        metadata: {
          calculatedBy: user?.id,
          activeFieldCount: resonanceState.activeFields.length
        } as any
      });
    } catch (error) {
      console.error('Error updating global resonance:', error);
    }
  }, [resonanceState, user]);

  const calculatePersonalContribution = useCallback(() => {
    if (!user) return 0;

    const personalFields = resonanceState.activeFields.filter(field => 
      field.participants.includes(user.id)
    );

    if (personalFields.length === 0) return 0;

    const contribution = personalFields.reduce((sum, field) => {
      const userContribution = field.collectiveInsights.length > 0 ? 0.3 : 0;
      const participationBonus = 0.2;
      return sum + userContribution + participationBonus;
    }, 0) / personalFields.length;

    return Math.min(1, contribution);
  }, [user, resonanceState.activeFields]);

  const getFieldRecommendations = useCallback(() => {
    const recommendations = [];

    // Recommend based on current global resonance
    if (resonanceState.globalResonance < 0.4) {
      recommendations.push({
        type: 'meditation',
        reason: 'Low global resonance - group meditation recommended',
        priority: 'high'
      });
    }

    if (resonanceState.fieldStability < 0.6) {
      recommendations.push({
        type: 'discussion',
        reason: 'Field instability - collaborative dialogue needed',
        priority: 'medium'
      });
    }

    if (resonanceState.activeFields.length < 2) {
      recommendations.push({
        type: 'creation',
        reason: 'Low field diversity - creative collaboration encouraged',
        priority: 'low'
      });
    }

    return recommendations;
  }, [resonanceState]);

  // Auto-update resonance periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeSession) {
        updateGlobalResonance();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [activeSession, updateGlobalResonance]);

  return {
    resonanceState,
    isConnected,
    activeSession,
    createResonanceField,
    joinResonanceField,
    leaveResonanceField,
    contributeToField,
    updateGlobalResonance,
    getFieldRecommendations,
    loadResonanceState
  };
}