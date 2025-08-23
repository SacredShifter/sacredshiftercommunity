import React from 'react';
import { motion } from 'framer-motion';

type Waypoint = {
  position: [number, number, number];
  message: string;
};

interface LegendProps {
  waypoints: Waypoint[];
  onWaypointClick: (index: number) => void;
}

export const Legend: React.FC<LegendProps> = ({ waypoints, onWaypointClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm p-4 rounded-lg text-white max-w-xs"
    >
      <h3 className="font-bold mb-2 text-lg">Waypoints</h3>
      <ul>
        {waypoints.map((waypoint, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-2 cursor-pointer"
            onClick={() => onWaypointClick(index)}
          >
            <span className="font-semibold">{index + 1}:</span> {waypoint.message}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};
