import React from 'react';
import { motion, AnimationProps, Transition } from 'framer-motion';

interface FlowerOfLifeIconProps {
  className?: string;
  animate?: AnimationProps['animate'];
  transition?: Transition;
}

const FlowerOfLifeIcon: React.FC<FlowerOfLifeIconProps> = ({ className, animate, transition }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      animate={animate}
      transition={transition}
    >
      <defs>
        <pattern id="hex" patternUnits="userSpaceOnUse" width="30" height="17.32" x="50" y="50">
          <polygon points="15,0 30,8.66 15,17.32 0,8.66" />
        </pattern>
        <mask id="mask">
          <rect width="100" height="100" fill="white" />
          <circle cx="50" cy="50" r="48" fill="black" />
        </mask>
      </defs>

      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Central circle */}
        <circle cx="50" cy="50" r="14.4" />

        {/* Inner ring of 6 circles */}
        {[0, 60, 120, 180, 240, 300].map(angle => (
          <circle
            key={`inner-${angle}`}
            cx={50 + 14.4 * Math.cos(angle * Math.PI / 180)}
            cy={50 + 14.4 * Math.sin(angle * Math.PI / 180)}
            r="14.4"
          />
        ))}

        {/* Outer ring of 12 circles */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
          <circle
            key={`outer-${angle}`}
            cx={50 + 28.8 * Math.cos(angle * Math.PI / 180)}
            cy={50 + 28.8 * Math.sin(angle * Math.PI / 180)}
            r="14.4"
            mask="url(#mask)"
          />
        ))}
        
        {/* Bounding circle */}
        <circle cx="50" cy="50" r="48" strokeWidth="1" />
      </g>
    </motion.svg>
  );
};

export default FlowerOfLifeIcon;
