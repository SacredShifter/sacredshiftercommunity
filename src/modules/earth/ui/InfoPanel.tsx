import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Waves, Wind, Magnet } from 'lucide-react';
import { BreathingMode } from '../machine';

const content = {
  forest: {
    title: 'Forest Breathing – 528 Hz',
    icon: <Leaf className="h-5 w-5 text-green-500" />,
    science: 'Forests inhale CO₂ and exhale O₂, creating the oxygen we breathe.',
    resonance: '528 Hz is known as the frequency of DNA repair and cellular regeneration — Gaia’s forests are her lungs, tuned to life’s healing note.',
    sacredWisdom: '“As Gaia restores herself through green breath, so do you. Inhale with her forests, exhale renewal into the world. Your breath completes her cycle.”',
  },
  ocean: {
    title: 'Ocean Breathing – 432 Hz',
    icon: <Waves className="h-5 w-5 text-blue-500" />,
    science: 'Oceans produce more than half of Earth’s oxygen through plankton, their tides pulled by the Moon’s rhythm.',
    resonance: '432 Hz resonates with the natural harmonic of the Earth’s vibration, the deep pulse of balance.',
    sacredWisdom: '“Feel the tides within you. As the Moon draws oceans, it draws your inner waters. Breathing with Gaia’s oceans brings your emotions into rhythm with eternity.”',
  },
  atmosphere: {
    title: 'Atmospheric Circulation – 639 Hz',
    icon: <Wind className="h-5 w-5 text-cyan-500" />,
    science: 'Winds and jet streams distribute heat, moisture, and gases around the planet, regulating balance.',
    resonance: '639 Hz carries the vibration of harmony and connection, like wind carrying intention across distance.',
    sacredWisdom: '“Breathe as the winds of Gaia — circulating balance through all you are. Your inhale receives equilibrium; your exhale releases harmony into creation.”',
  },
  magnetic: {
    title: 'Magnetic Breathing – 7.83 Hz',
    icon: <Magnet className="h-5 w-5 text-purple-500" />,
    science: 'Earth’s magnetosphere protects life by shielding against solar radiation. Fluctuations manifest as auroras.',
    resonance: '7.83 Hz is the Schumann Resonance, the measurable heartbeat of Earth’s electromagnetic field.',
    sacredWisdom: '“Rest into Gaia’s heartbeat. As her auroras shimmer, her shield surrounds you. Inhale her protection, exhale your strength. You are her field, and she is yours.”',
  },
};

interface InfoPanelProps {
  mode: BreathingMode;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ mode }) => {
  if (!mode) return null;

  const { title, icon, science, resonance, sacredWisdom } = content[mode];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="absolute top-1/2 -translate-y-1/2 right-6 z-10 max-w-md"
    >
      <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Science:</h4>
            <p className="text-xs text-muted-foreground">{science}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Resonance:</h4>
            <p className="text-xs text-muted-foreground">{resonance}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Sacred Wisdom:</h4>
            <p className="text-xs italic text-muted-foreground">{sacredWisdom}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
