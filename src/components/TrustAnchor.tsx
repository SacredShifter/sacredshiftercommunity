import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface TrustAnchorProps {
  onTrustEstablished?: () => void;
  duration?: number;
}

export const TrustAnchor: React.FC<TrustAnchorProps> = ({ 
  onTrustEstablished, 
  duration = 3000 
}) => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
      onTrustEstablished?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onTrustEstablished]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="flex flex-col items-center gap-4"
      >
        <Heart className="w-12 h-12 text-primary" />
        <p className="text-center text-muted-foreground">
          Establishing trust anchor...
        </p>
      </motion.div>
    </motion.div>
  );
};