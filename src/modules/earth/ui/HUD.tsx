import React from 'react';
import { useEarthState } from '../context/EarthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Flower } from 'lucide-react';
import { InfoPanel } from './InfoPanel';
import { CelestialWisdom } from './CelestialWisdom';

export const HUD: React.FC = () => {
  const { state, send, onExit } = useEarthState();

  return (
    <>
      <div className="fixed top-4 left-4">
        <Button variant="ghost" size="sm" onClick={onExit} className="bg-black/50 text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Exit
        </Button>
      </div>

      {state.matches('ground') && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
          <Button onClick={() => send({ type: 'BREATHE' })} className="bg-green-600 hover:bg-green-700">
            <Flower className="w-4 h-4 mr-2" />
            Start Gaia Breathing
          </Button>
        </div>
      )}

      {state.matches('breathing') && (
        <>
          <div className="fixed top-4 right-4">
            <Button onClick={() => send({ type: 'BACK' })} variant="outline">
              Back to Ground
            </Button>
          </div>
          <div className="fixed bottom-4 right-4">
            <Button onClick={() => send({ type: 'TOGGLE_BREATH_SYNC' })}>
              {state.matches('breathing.syncing') ? 'Auto Breath' : 'Sync Breath'}
            </Button>
          </div>
          <div className="fixed bottom-4 left-4 space-y-2">
            <h3 className="text-white font-bold">Breathing Modes</h3>
            <Button onClick={() => send({ type: 'SELECT_BREATHING_MODE', mode: 'forest' })}>Forest</Button>
            <Button onClick={() => send({ type: 'SELECT_BREATHING_MODE', mode: 'ocean' })}>Ocean</Button>
            <Button onClick={() => send({ type: 'SELECT_BREATHING_MODE', mode: 'atmosphere' })}>Atmosphere</Button>
            <Button onClick={() => send({ type: 'SELECT_BREATHING_MODE', mode: 'magnetic' })}>Magnetic</Button>
          </div>
          <div className="fixed bottom-1/2 right-4 transform translate-y-1/2">
            <input
              type="range"
              min="0"
              max="62.8"
              step="0.1"
              onChange={(e) => send({ type: 'SET_CELESTIAL_TIME', time: parseFloat(e.target.value) })}
              className="w-48"
              style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
            />
          </div>
          <InfoPanel mode={state.context.breathingMode} />
          <CelestialWisdom celestialBody={state.context.celestialBody} />
        </>
      )}
    </>
  );
};