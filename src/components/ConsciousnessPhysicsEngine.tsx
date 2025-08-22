import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BiometricState {
  heartRate: number;
  breathing: number;
  stress: number;
  focus: number;
  coherence: number;
}

interface PhysicsProps {
  biometricState: BiometricState;
  children: React.ReactNode;
  messageType: 'sent' | 'received';
  content: string;
}

export const ConsciousnessPhysicsEngine: React.FC<PhysicsProps> = ({
  biometricState,
  children,
  messageType,
  content
}) => {
  // Calculate animation properties based on nervous system state
  const getPhysicsFromBiometrics = () => {
    const { heartRate, breathing, stress, focus, coherence } = biometricState;
    
    // High stress = sharper, staccato motion
    if (stress > 0.7) {
      return {
        initial: { opacity: 0, scale: 0.8, rotate: -2 },
        animate: { 
          opacity: 1, 
          scale: 1, 
          rotate: 0,
          transition: {
            type: "spring" as const,
            stiffness: 400,
            damping: 10,
            duration: 0.3
          }
        },
        whileHover: { 
          scale: 1.02,
          rotate: Math.random() * 4 - 2,
          transition: { type: "spring" as const, stiffness: 300 }
        }
      };
    }
    
    // High coherence = smooth golden ratio timing
    if (coherence > 0.8) {
      return {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 1.618, // Golden ratio
            ease: [0.25, 0.1, 0.25, 1] as const // Custom bezier for harmony
          }
        },
        whileHover: { 
          scale: 1.05,
          boxShadow: "0 10px 30px rgba(255, 215, 0, 0.3)",
          transition: { duration: 0.618 }
        }
      };
    }
    
    // High focus = precise, crystalline movement
    if (focus > 0.7) {
      return {
        initial: { opacity: 0, x: messageType === 'sent' ? 10 : -10 },
        animate: { 
          opacity: 1, 
          x: 0,
          transition: {
            type: "tween" as const,
            ease: "easeOut" as const,
            duration: 0.4
          }
        },
        whileHover: { 
          scale: 1.01,
          transition: { type: "tween" as const, duration: 0.2 }
        }
      };
    }
    
    // Calm/meditative state = flowing, wave-like motion
    if (stress < 0.3 && heartRate < 70) {
      return {
        initial: { opacity: 0, y: 30, scale: 0.9 },
        animate: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 20,
            duration: 1.2
          }
        },
        whileHover: { 
          y: -2,
          scale: 1.03,
          transition: { 
            type: "spring" as const, 
            stiffness: 150,
            damping: 15 
          }
        }
      };
    }
    
    // Default balanced state
    return {
      initial: { opacity: 0, scale: 0.95 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" as const }
      },
      whileHover: { scale: 1.02 }
    };
  };

  // Calculate message glow based on biometric intensity
  const getGlowIntensity = () => {
    const { coherence, focus, stress } = biometricState;
    
    if (coherence > 0.8) return 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))';
    if (focus > 0.7) return 'drop-shadow(0 0 10px rgba(100, 200, 255, 0.5))';
    if (stress > 0.7) return 'drop-shadow(0 0 8px rgba(255, 100, 100, 0.4))';
    
    return 'none';
  };

  // Breathing synchronization for container
  const getBreathingAnimation = () => {
    const breathingRate = biometricState.breathing || 15; // breaths per minute
    const cycleDuration = 60 / breathingRate; // seconds per breath
    
    return {
      scale: [1, 1.005, 1],
      transition: {
        duration: cycleDuration,
        ease: "easeInOut",
        repeat: Infinity
      }
    };
  };

  const physics = getPhysicsFromBiometrics();

  return (
    <motion.div
      {...physics}
      style={{
        filter: getGlowIntensity()
      }}
    >
      {children}
    </motion.div>
  );
};