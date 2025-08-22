import React from 'react';
import { useEarthState } from '../context/EarthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const HUD: React.FC = () => {
  const { onExit } = useEarthState();

  return (
    <div className="fixed top-4 left-4">
      <Button variant="ghost" size="sm" onClick={onExit} className="bg-black/50 text-white">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Exit
      </Button>
    </div>
  );
};