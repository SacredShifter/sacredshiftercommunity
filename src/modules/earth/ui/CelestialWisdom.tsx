import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon } from 'lucide-react';

const wisdom = {
  sun: {
    title: 'Sun Pulse – 963 Hz',
    icon: <Sun className="h-5 w-5 text-yellow-500" />,
    sacredWisdom: '“Inhale Gaia’s sunlight as golden breath. With every ray, the cosmos awakens in you. Life’s fire burns in your chest as it burns in hers.”',
  },
  moon: {
    title: 'Moon Pulse – 336 Hz',
    icon: <Moon className="h-5 w-5 text-gray-400" />,
    sacredWisdom: '“Exhale with the Moon. Let her draw away heaviness as she pulls the tides. Your breath flows with her rhythm, your waters aligned with hers.”',
  },
};

interface CelestialWisdomProps {
  celestialBody: 'sun' | 'moon' | null;
}

export const CelestialWisdom: React.FC<CelestialWisdomProps> = ({ celestialBody }) => {
  if (!celestialBody) return null;

  const { title, icon, sacredWisdom } = wisdom[celestialBody];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-10 max-w-md"
    >
      <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs italic text-muted-foreground">{sacredWisdom}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
