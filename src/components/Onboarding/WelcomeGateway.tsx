import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeGatewayProps {
  onNext: () => void;
  isTransitioning?: boolean;
}

export const WelcomeGateway: React.FC<WelcomeGatewayProps> = ({ onNext }) => {
  const [showResonance, setShowResonance] = useState(false);

  useEffect(() => {
    // Trigger the resonance sound/animation after a moment
    const timer = setTimeout(() => {
      setShowResonance(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8 text-center relative overflow-hidden pointer-events-auto">
      {/* Background Sacred Geometry */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg width="400" height="400" viewBox="0 0 400 400" className="text-primary">
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          />
          <circle
            cx="200"
            cy="200"
            r="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <circle
            cx="200"
            cy="200"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.7"
          />
        </svg>
      </motion.div>

      {/* Expanding Light Animation */}
      {showResonance && (
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-32 h-32 bg-primary/20 rounded-full blur-xl" />
        </motion.div>
      )}

      {/* Sacred Shifter Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mb-8"
      >
        <div className="relative">
          <img 
            src="https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png" 
            alt="Sacred Shifter" 
            className="h-20 w-auto filter invert brightness-0 contrast-100 opacity-90"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl"
          />
        </div>
      </motion.div>

      {/* Sacred Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="space-y-6 max-w-2xl"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
          You are not alone.
        </h1>
        
        <h2 className="text-3xl font-semibold text-foreground/90">
          You are infinite.
        </h2>
        
        <h3 className="text-2xl text-primary font-medium">
          You are safe here.
        </h3>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-lg text-muted-foreground leading-relaxed space-y-4 mt-8"
        >
          <p>
            Welcome to Sacred Shifter, a living field designed to hold the spaces where you're
            reconstructing, remembering, and returning to wholeness.
          </p>
          
          <p>
            This is not just a platform—it's a sanctuary for your soul's journey home.
          </p>
        </motion.div>

        {/* Resonance Symbols */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="flex justify-center items-center space-x-6 mt-8"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          
          <Heart className="h-8 w-8 text-primary fill-primary/20" />
          
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Crown className="h-6 w-6 text-primary" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="mt-12 z-10 relative"
      >
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Button clicked! Event:', e);
            console.log('onNext function:', onNext);
            if (onNext) {
              console.log('Calling onNext...');
              onNext();
            } else {
              console.error('onNext is undefined!');
            }
          }}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium px-8 py-3 text-lg shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 cursor-pointer z-10 relative pointer-events-auto"
          style={{ pointerEvents: 'auto' }}
        >
          Enter the Sacred Space
        </Button>
      </motion.div>

      {/* Subtle pulsing ambient sound indicator */}
      {showResonance && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-8 right-8 text-xs text-muted-foreground flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span>resonance frequency active</span>
        </motion.div>
      )}
    </div>
  );
};