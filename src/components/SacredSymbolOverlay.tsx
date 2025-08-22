import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SacredSymbolProps {
  groupCoherence: number;
  heartRateSync: number;
  breathSync: number;
  className?: string;
}

export const SacredSymbolOverlay: React.FC<SacredSymbolProps> = ({
  groupCoherence,
  heartRateSync,
  breathSync,
  className = ""
}) => {
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);
  const [symbolOpacity, setSymbolOpacity] = useState(0);

  // Determine which sacred symbol to show based on coherence levels
  useEffect(() => {
    const overallCoherence = (groupCoherence + heartRateSync + breathSync) / 3;
    
    if (overallCoherence > 0.9) {
      setActiveSymbol('flower-of-life');
      setSymbolOpacity(Math.min(0.4, overallCoherence - 0.6));
    } else if (overallCoherence > 0.75) {
      setActiveSymbol('seed-of-life');
      setSymbolOpacity(Math.min(0.3, overallCoherence - 0.5));
    } else if (overallCoherence > 0.6) {
      setActiveSymbol('merkaba');
      setSymbolOpacity(Math.min(0.25, overallCoherence - 0.4));
    } else if (overallCoherence > 0.45) {
      setActiveSymbol('sri-yantra');
      setSymbolOpacity(Math.min(0.2, overallCoherence - 0.3));
    } else if (overallCoherence > 0.3) {
      setActiveSymbol('hexagon');
      setSymbolOpacity(Math.min(0.15, overallCoherence - 0.2));
    } else {
      setActiveSymbol(null);
      setSymbolOpacity(0);
    }
  }, [groupCoherence, heartRateSync, breathSync]);

  const renderSymbol = (symbolType: string) => {
    const symbolData = getSymbolData(symbolType);
    
    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        animate={{ 
          opacity: symbolOpacity, 
          scale: 1,
          rotate: symbolType === 'merkaba' ? 360 : 0
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ 
          duration: 2, 
          rotate: symbolType === 'merkaba' ? { duration: 20, repeat: Infinity, ease: "linear" } : {}
        }}
      >
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="text-primary/30"
        >
          {symbolData}
        </svg>
      </motion.div>
    );
  };

  const getSymbolData = (symbolType: string) => {
    switch (symbolType) {
      case 'flower-of-life':
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6">
            <circle cx="150" cy="150" r="40" />
            <circle cx="115" cy="120" r="40" />
            <circle cx="185" cy="120" r="40" />
            <circle cx="115" cy="180" r="40" />
            <circle cx="185" cy="180" r="40" />
            <circle cx="150" cy="100" r="40" />
            <circle cx="150" cy="200" r="40" />
            <circle cx="80" cy="150" r="40" />
            <circle cx="220" cy="150" r="40" />
            <circle cx="95" cy="95" r="40" />
            <circle cx="205" cy="95" r="40" />
            <circle cx="95" cy="205" r="40" />
            <circle cx="205" cy="205" r="40" />
          </g>
        );
        
      case 'seed-of-life':
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7">
            <circle cx="150" cy="150" r="45" />
            <circle cx="120" cy="125" r="45" />
            <circle cx="180" cy="125" r="45" />
            <circle cx="120" cy="175" r="45" />
            <circle cx="180" cy="175" r="45" />
            <circle cx="150" cy="105" r="45" />
            <circle cx="150" cy="195" r="45" />
          </g>
        );
        
      case 'merkaba':
        return (
          <g fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8">
            <path d="M150 50 L250 150 L150 250 L50 150 Z" />
            <path d="M150 50 L250 150 L150 250 L50 150 Z" transform="rotate(45 150 150)" />
            <circle cx="150" cy="150" r="60" strokeDasharray="5,5" />
          </g>
        );
        
      case 'sri-yantra':
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6">
            <circle cx="150" cy="150" r="80" />
            <circle cx="150" cy="150" r="60" />
            <circle cx="150" cy="150" r="40" />
            <circle cx="150" cy="150" r="20" />
            <path d="M150 70 L210 190 L90 190 Z" />
            <path d="M150 230 L90 110 L210 110 Z" />
            <path d="M100 130 L200 130 L150 200 Z" />
            <path d="M200 170 L100 170 L150 100 Z" />
          </g>
        );
        
      case 'hexagon':
        return (
          <g fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5">
            <path d="M150 70 L210 110 L210 190 L150 230 L90 190 L90 110 Z" />
            <path d="M150 90 L190 120 L190 180 L150 210 L110 180 L110 120 Z" />
            <circle cx="150" cy="150" r="25" />
          </g>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-10 ${className}`}>
      <AnimatePresence mode="wait">
        {activeSymbol && renderSymbol(activeSymbol)}
      </AnimatePresence>
      
      {/* Coherence field visualization */}
      {symbolOpacity > 0 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, rgba(147, 51, 234, ${symbolOpacity * 0.1}) 0%, transparent 70%)`
          }}
          animate={{
            opacity: [symbolOpacity * 0.5, symbolOpacity, symbolOpacity * 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Text indicator when symbols emerge */}
      <AnimatePresence>
        {activeSymbol && (
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.9, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-sm text-primary font-medium text-center">
              ✨ Group Coherence Field Active
              <div className="text-xs text-primary/70 mt-1">
                Sacred {activeSymbol.replace('-', ' ')} emerging
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};