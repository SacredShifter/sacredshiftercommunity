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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-4">
              Sacred Shifter Video Library
            </h1>
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