import React from 'react';
import { motion } from 'framer-motion';

import { YouTubeLibrary } from '@/components/YouTubeLibrary/YouTubeLibrary';

const VideoLibrary: React.FC = () => {
  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <img 
                src="https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png" 
                alt="Sacred Shifter" 
                className="h-16 w-auto filter invert brightness-0 contrast-100 opacity-90"
              />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Immerse yourself in our collection of transformative content. 
              Explore guided journeys, resonance science, and consciousness-expanding videos.
            </p>
          </motion.div>
          
          <YouTubeLibrary />
      </motion.div>
      </div>
    </div>
  );
};

export default VideoLibrary;