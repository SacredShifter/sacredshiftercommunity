import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Waves } from 'lucide-react';

interface TrustIntroductionProps {
  onNext: () => void;
}

export const TrustIntroduction: React.FC<TrustIntroductionProps> = ({ onNext }) => {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center space-y-8"
      >
        {/* Core Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Sovereignty at the Speed of Trust
          </h1>
          <p className="text-lg text-muted-foreground">
            Sacred Shifter is not another app. It is a sovereignty cultivation system.
          </p>
        </motion.div>

        {/* Trust Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-6 text-left"
        >
          <div className="flex items-start gap-4 p-4 rounded-lg bg-card border">
            <Heart className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">The Nervous System is the Real Student</h3>
              <p className="text-sm text-muted-foreground">
                It does not learn at the speed of data. It learns at the speed of safety. 
                At the speed of breath. At the speed of trust.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 rounded-lg bg-card border">
            <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Dissolving Distortion</h3>
              <p className="text-sm text-muted-foreground">
                Not with explanations, but with experiences. Not with content, but with ritual. 
                Not with pressure, but with presence.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 rounded-lg bg-card border">
            <Waves className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Trust Transmission</h3>
              <p className="text-sm text-muted-foreground">
                This is not information transfer. This is trust transmission. 
                A new operating system for human freedom.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sacred Declaration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
        >
          <p className="text-sm leading-relaxed">
            Here, fear of death unravels. Here, fear of life releases. 
            Here, sovereignty roots in the body.
          </p>
        </motion.div>

        {/* Enter Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={onNext}
          className="w-full py-4 px-8 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Enter Sacred Shifter
        </motion.button>
      </motion.div>
    </div>
  );
};