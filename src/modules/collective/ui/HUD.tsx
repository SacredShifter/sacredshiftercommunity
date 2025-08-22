import React from 'react';
import { useCollectiveState } from '../context/CollectiveContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const HUD: React.FC = () => {
  const { onExit } = useCollectiveState();

  return (
    <div className="fixed top-4 left-4">
      <Button variant="ghost" size="sm" onClick={onExit} className="bg-black/50 text-white">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Exit
      </Button>
    </div>
  );
};