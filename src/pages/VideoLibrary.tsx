import React from 'react';
import { motion } from 'framer-motion';
import { YouTubeLibrary } from '@/components/YouTubeLibrary/YouTubeLibrary';

const VideoLibrary: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full overflow-y-auto"
    >
      <YouTubeLibrary />
    </motion.div>
  );
};

export default VideoLibrary;