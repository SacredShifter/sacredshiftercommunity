import React from 'react';
import { motion } from 'framer-motion';
import { ParallaxBackground } from '@/components/ParallaxBackground';
import { YouTubeLibrary } from '@/components/YouTubeLibrary/YouTubeLibrary';

const VideoLibrary: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <ParallaxBackground />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <img 
                src="/src/assets/sacred-shifter-logo.png" 
                alt="Sacred Shifter" 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Immerse yourself in our collection of transformative content. 
              Explore guided journeys, resonance science, and consciousness-expanding videos.
            </p>
          </motion.div>
          
          <YouTubeLibrary />
        </div>
      </motion.div>
    </div>
  );
};

export default VideoLibrary;