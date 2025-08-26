import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, Globe } from 'lucide-react';

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
  mercury: {
    title: 'Mercury’s Message',
    icon: <Globe className="h-5 w-5 text-gray-400" />,
    sacredWisdom: '“Breathe with Mercury, the messenger. Let your thoughts become clear and your words true. Connect your mind to the cosmic web of information.”',
  },
  venus: {
    title: 'Venus’s Embrace',
    icon: <Globe className="h-5 w-5 text-pink-400" />,
    sacredWisdom: '“Inhale the grace of Venus. Let her beauty fill your heart and harmonize your relationships. Your love is a reflection of her divine light.”',
  },
  mars: {
    title: 'Mars’s Fire',
    icon: <Globe className="h-5 w-5 text-red-500" />,
    sacredWisdom: '“Breathe in the fire of Mars. Feel your courage and your will ignite. Your action is the spear that pierces illusion.”',
  },
  jupiter: {
    title: 'Jupiter’s Expansion',
    icon: <Globe className="h-5 w-5 text-orange-400" />,
    sacredWisdom: '“Inhale the abundance of Jupiter. Let your spirit expand beyond all limits. Your growth is a testament to the universe’s generosity.”',
  },
  saturn: {
    title: 'Saturn’s Structure',
    icon: <Globe className="h-5 w-5 text-yellow-600" />,
    sacredWisdom: '“Exhale with Saturn’s wisdom. Let go of what no longer serves you. Your discipline is the foundation upon which your temple is built.”',
  },
  uranus: {
    title: 'Uranus’s Awakening',
    icon: <Globe className="h-5 w-5 text-cyan-400" />,
    sacredWisdom: '“Inhale the shock of Uranus. Awaken to new possibilities and sudden insights. Your liberation is a lightning strike in the cosmic storm.”',
  },
  neptune: {
    title: 'Neptune’s Dream',
    icon: <Globe className="h-5 w-5 text-blue-400" />,
    sacredWisdom: '“Dissolve into Neptune’s dream. Let your imagination flow into the cosmic ocean. Your intuition is the whisper of the deep.”',
  },
};

interface CelestialWisdomProps {
  celestialBody: 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | null;
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
