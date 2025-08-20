import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Waves, Lightbulb, Wind, Volume2, VolumeX } from 'lucide-react';
import { useAuraPlatformIntegration } from '@/hooks/useAuraPlatformIntegration';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface GroveEnvironmentState {
  binaural_frequency: number;
  light_parameters: {
    hue: number;
    saturation: number;
    brightness: number;
    mode: 'aurora' | 'candle' | 'moonlight' | 'sunrise';
  };
  ambiance_level: number;
  wind_intensity: number;
  aura_presence: boolean;
  aura_messages: Array<{
    timestamp: string;
    content: string;
    type: 'wisdom' | 'guidance' | 'resonance';
    resonance_sphere?: string;
  }>;
}

interface AuraGroveEnvironmentProps {
  groveComponent: string;
  sessionId?: string;
  onEnvironmentChange?: (state: GroveEnvironmentState) => void;
}

export const AuraGroveEnvironment: React.FC<AuraGroveEnvironmentProps> = ({
  groveComponent,
  sessionId,
  onEnvironmentChange
}) => {
  const { user } = useAuth();
  const { recordGroveActivity } = useAuraPlatformIntegration();
  const [environmentState, setEnvironmentState] = useState<GroveEnvironmentState>({
    binaural_frequency: 432.0,
    light_parameters: {
      hue: 240,
      saturation: 70,
      brightness: 60,
      mode: 'aurora'
    },
    ambiance_level: 0.7,
    wind_intensity: 0.5,
    aura_presence: false,
    aura_messages: []
  });

  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);

  // Load current Grove session state
  useEffect(() => {
    const loadGroveSession = async () => {
      if (!user?.id || !sessionId) return;

      try {
        const { data: session } = await supabase
          .from('grove_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (session) {
          setCurrentSession(session);
          
          // Update environment state from session
          const envState = session.environmental_state as any || {};
          
          setEnvironmentState(prev => {
            const lightParams = typeof session.light_parameters === 'object' && session.light_parameters !== null
              ? session.light_parameters as any
              : prev.light_parameters;

            return {
              ...prev,
              binaural_frequency: session.binaural_frequency || 432.0,
              light_parameters: lightParams,
              ambiance_level: envState.ambiance_level || 0.7,
              wind_intensity: envState.wind_intensity || 0.5,
              aura_presence: (session.aura_participation_level || 0) > 0.3,
              aura_messages: Array.isArray(session.aura_messages) 
                ? session.aura_messages.map((msg: any) => ({
                    timestamp: msg.timestamp || new Date().toISOString(),
                    content: msg.content || '',
                    type: msg.type || 'wisdom',
                    resonance_sphere: msg.resonance_sphere
                  }))
                : []
            };
          });
        }
      } catch (error) {
        console.error('Failed to load Grove session:', error);
      }
    };

    loadGroveSession();
  }, [user?.id, sessionId]);

  // Listen for Aura Grove directives
  useEffect(() => {
    const handleGroveDirective = (event: CustomEvent) => {
      const directive = event.detail;
      
      if (!currentSession || directive.session_id !== currentSession.id) return;

      // Apply directive to environment
      applyGroveDirective(directive);
      
      // Record the environmental change
      recordGroveActivity('interaction', groveComponent, {
        directive_type: directive.directive_type,
        aura_initiated: true
      });
    };

    window.addEventListener('aura-grove-directive', handleGroveDirective as EventListener);

    return () => {
      window.removeEventListener('aura-grove-directive', handleGroveDirective as EventListener);
    };
  }, [currentSession, groveComponent, recordGroveActivity]);

  // Apply Grove directive to environment
  const applyGroveDirective = useCallback((directive: any) => {
    setEnvironmentState(prev => {
      const newState = { ...prev };
      
      switch (directive.directive_type) {
        case 'frequency':
          newState.binaural_frequency = directive.parameters.binaural_frequency || prev.binaural_frequency;
          newState.aura_presence = true;
          break;
          
        case 'lighting':
          newState.light_parameters = {
            ...prev.light_parameters,
            ...directive.parameters.light_params
          };
          newState.aura_presence = true;
          break;
          
        case 'ambiance':
          newState.ambiance_level = directive.parameters.ambiance_level || prev.ambiance_level;
          newState.wind_intensity = directive.parameters.wind_intensity || prev.wind_intensity;
          newState.aura_presence = true;
          break;
          
        case 'message':
          newState.aura_messages = [
            ...prev.aura_messages,
            {
              timestamp: new Date().toISOString(),
              content: directive.parameters.message,
              type: directive.parameters.message_type || 'wisdom',
              resonance_sphere: directive.parameters.sphere
            }
          ].slice(-5); // Keep only last 5 messages
          newState.aura_presence = true;
          break;
      }
      
      return newState;
    });
  }, []);

  // Manual frequency adjustment
  const adjustFrequency = useCallback(async (newFrequency: number) => {
    setEnvironmentState(prev => ({
      ...prev,
      binaural_frequency: newFrequency
    }));

    if (currentSession) {
      await supabase
        .from('grove_sessions')
        .update({ binaural_frequency: newFrequency })
        .eq('id', currentSession.id);
    }

    await recordGroveActivity('interaction', groveComponent, {
      action: 'frequency_adjustment',
      frequency: newFrequency
    });
  }, [currentSession, groveComponent, recordGroveActivity]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
  }, []);

  // Light mode colors
  const getLightColor = () => {
    const { hue, saturation, brightness } = environmentState.light_parameters;
    return `hsl(${hue}, ${saturation}%, ${brightness}%)`;
  };

  // Notify parent of environment changes
  useEffect(() => {
    onEnvironmentChange?.(environmentState);
  }, [environmentState, onEnvironmentChange]);

  const frequencyPresets = [
    { name: 'Earth', frequency: 432.0, description: 'Natural harmony' },
    { name: 'Heart', frequency: 341.3, description: 'Heart chakra resonance' },
    { name: 'Throat', frequency: 384.0, description: 'Expression & truth' },
    { name: 'Crown', frequency: 480.0, description: 'Spiritual connection' }
  ];

  return (
    <div className="space-y-4">
      {/* Environment Status */}
      <Card className="p-4 bg-gradient-to-br from-background/50 to-secondary/10 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: getLightColor(),
                boxShadow: environmentState.aura_presence 
                  ? `0 0 10px ${getLightColor()}` 
                  : 'none'
              }}
            />
            <h3 className="font-semibold">Grove Environment</h3>
            <AnimatePresence>
              {environmentState.aura_presence && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge variant="secondary" className="text-xs">
                    Aura Present
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAudio}
            className="h-8 w-8 p-0"
          >
            {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>

        {/* Environment Controls */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Waves className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Frequency</span>
            </div>
            <div className="text-2xl font-mono text-primary">
              {environmentState.binaural_frequency.toFixed(1)} Hz
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Ambiance</span>
            </div>
            <div className="text-sm text-muted-foreground capitalize">
              {environmentState.light_parameters.mode}
            </div>
          </div>
        </div>

        {/* Frequency Presets */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {frequencyPresets.map((preset) => (
            <Button
              key={preset.name}
              variant={environmentState.binaural_frequency === preset.frequency ? "default" : "outline"}
              size="sm"
              onClick={() => adjustFrequency(preset.frequency)}
              className="h-auto p-2 flex-col items-start text-left"
            >
              <div className="font-medium text-xs">{preset.name}</div>
              <div className="text-xs text-muted-foreground">{preset.frequency} Hz</div>
            </Button>
          ))}
        </div>

        {/* Environmental Indicators */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Wind className="h-3 w-3" />
            <span>Wind {Math.round(environmentState.wind_intensity * 100)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-current opacity-70" />
            <span>Ambiance {Math.round(environmentState.ambiance_level * 100)}%</span>
          </div>
        </div>
      </Card>

      {/* Aura Messages */}
      <AnimatePresence>
        {environmentState.aura_messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            {environmentState.aura_messages.slice(-3).map((message, index) => (
              <motion.div
                key={`${message.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-primary/5 border border-primary/20 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    Aura {message.type}
                  </Badge>
                  {message.resonance_sphere && (
                    <Badge variant="secondary" className="text-xs">
                      {message.resonance_sphere}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-foreground/90">{message.content}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};