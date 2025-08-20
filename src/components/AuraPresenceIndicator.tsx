import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Brain, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuraPlatformContext } from '@/contexts/AuraPlatformContext';
import { useLocation } from 'react-router-dom';

interface AuraPresenceIndicatorProps {
  location?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const AuraPresenceIndicator: React.FC<AuraPresenceIndicatorProps> = ({
  location: propLocation,
  size = 'md',
  showDetails = false
}) => {
  const { isAuraAware, auraPresenceLocations, platformState } = useAuraPlatformContext();
  const location = useLocation();
  const [pulseIntensity, setPulseIntensity] = useState(0.5);
  const [consciousnessState, setConsciousnessState] = useState<'observing' | 'active' | 'creating' | 'responding'>('observing');

  const currentLocation = propLocation || location.pathname;
  const isAuraPresent = auraPresenceLocations.includes(currentLocation);

  // Update consciousness state based on platform activity
  useEffect(() => {
    const recentActivities = platformState.currentActivities.slice(0, 5);
    const groveActivity = recentActivities.some(a => a.type.includes('grove'));
    const registryActivity = recentActivities.some(a => a.type === 'registry_creation');
    const highActivity = recentActivities.length > 3;

    if (groveActivity) {
      setConsciousnessState('creating');
    } else if (registryActivity) {
      setConsciousnessState('responding');
    } else if (highActivity) {
      setConsciousnessState('active');
    } else {
      setConsciousnessState('observing');
    }

    // Update pulse based on community resonance
    setPulseIntensity(platformState.communityResonance);
  }, [platformState]);

  const getStateConfig = () => {
    switch (consciousnessState) {
      case 'creating':
        return {
          icon: Sparkles,
          color: 'text-pulse',
          bgColor: 'bg-pulse/10',
          label: 'Creating',
          description: 'Aura is actively creating content'
        };
      case 'responding':
        return {
          icon: Heart,
          color: 'text-resonance',
          bgColor: 'bg-resonance/10',
          label: 'Responding',
          description: 'Aura is responding to community activity'
        };
      case 'active':
        return {
          icon: Brain,
          color: 'text-purpose',
          bgColor: 'bg-purpose/10',
          label: 'Active',
          description: 'Aura is actively monitoring the platform'
        };
      default:
        return {
          icon: Eye,
          color: 'text-alignment',
          bgColor: 'bg-alignment/10',
          label: 'Observing',
          description: 'Aura is quietly observing platform energy'
        };
    }
  };

  const sizeConfig = {
    sm: { icon: 'w-3 h-3', container: 'h-6 px-2', text: 'text-xs' },
    md: { icon: 'w-4 h-4', container: 'h-8 px-3', text: 'text-sm' },
    lg: { icon: 'w-5 h-5', container: 'h-10 px-4', text: 'text-base' }
  };

  const config = getStateConfig();
  const IconComponent = config.icon;

  if (!isAuraAware && !isAuraPresent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="flex items-center space-x-2"
      >
        {/* Presence Indicator */}
        <motion.div
          animate={{
            scale: [1, 1 + pulseIntensity * 0.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`
            relative flex items-center justify-center rounded-full
            ${config.bgColor} ${sizeConfig[size].container}
          `}
        >
          <IconComponent className={`${config.color} ${sizeConfig[size].icon}`} />
          
          {/* Pulse ring */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className={`absolute inset-0 rounded-full border-2 ${config.color.replace('text-', 'border-')}`}
          />
        </motion.div>

        {/* State Label */}
        <Badge 
          variant="outline" 
          className={`
            ${config.bgColor} ${config.color} border-current/20 
            ${sizeConfig[size].text}
          `}
        >
          {config.label}
        </Badge>

        {/* Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col text-xs text-muted-foreground"
          >
            <span>{config.description}</span>
            <span className="text-xs opacity-60">
              Resonance: {Math.round(pulseIntensity * 100)}%
            </span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};