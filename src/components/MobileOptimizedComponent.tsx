import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface MobileOptimizedComponentProps {
  children: ReactNode;
  className?: string;
  enableSacredGeometry?: boolean;
}

export function MobileOptimizedComponent({ 
  children, 
  className = '', 
  enableSacredGeometry = false 
}: MobileOptimizedComponentProps) {
  const { 
    getAnimationSettings, 
    getSacredGeometrySettings, 
    isMobile, 
    isLowPower,
    hasGoodConnection 
  } = useMobileOptimization();
  
  const animationSettings = getAnimationSettings();
  const geometrySettings = getSacredGeometrySettings();

  // Mobile-optimized motion settings
  const motionProps = {
    initial: { opacity: 0, y: isMobile ? 10 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: animationSettings.duration,
      ease: animationSettings.ease
    }
  };

  // Sacred geometry background for mobile
  const renderMobileSacredGeometry = () => {
    if (!enableSacredGeometry || isLowPower) return null;
    
    return (
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: hasGoodConnection ? 
            'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)' :
            'radial-gradient(circle, hsl(var(--muted)) 1px, transparent 1px)',
          backgroundSize: geometrySettings.complexity === 'high' ? '40px 40px' : '60px 60px'
        }}
      />
    );
  };

  if (animationSettings.reduce) {
    // No animations for low power mode
    return (
      <div className={`relative ${className}`}>
        {renderMobileSacredGeometry()}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`relative ${className}`}
      {...motionProps}
    >
      {renderMobileSacredGeometry()}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}