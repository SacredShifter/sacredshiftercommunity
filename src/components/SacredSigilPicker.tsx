import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Heart, Zap } from 'lucide-react';
import { useSacredSigilEngine } from '@/hooks/useSacredSigilEngine';
import { getSigilsByCategory } from '@/data/sacredSigilCodex';
import { SacredSigil } from '@/types/sacredSigils';

interface SacredSigilPickerProps {
  onSigilSelect: (sigil: SacredSigil) => void;
}

export const SacredSigilPicker: React.FC<SacredSigilPickerProps> = ({ onSigilSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { consciousness, getRecommendedSigils, calculateSigilResonance } = useSacredSigilEngine();

  const handleSigilClick = (sigil: SacredSigil) => {
    onSigilSelect(sigil);
    setIsOpen(false);
  };

  const renderSigilButton = (sigil: SacredSigil, isRecommended = false) => {
    const resonance = calculateSigilResonance(sigil.id);
    
    return (
      <Button
        key={sigil.id}
        variant="ghost"
        size="sm"
        className={`relative h-12 w-12 p-0 transition-all duration-300 ${
          isRecommended 
            ? 'bg-primary/20 border border-primary/40 hover:bg-primary/30' 
            : 'hover:bg-accent/20'
        }`}
        onClick={() => handleSigilClick(sigil)}
        title={`${sigil.name}: ${sigil.intent}`}
      >
        <span 
          className="text-2xl"
          style={{ 
            color: sigil.metadata.auraColor,
            filter: `brightness(${1 + resonance * 0.3})`,
            textShadow: `0 0 ${4 + resonance * 2}px ${sigil.metadata.auraColor}`
          }}
        >
          {sigil.symbol}
        </span>
        {isRecommended && (
          <div className="absolute -top-1 -right-1">
            <div className="w-2 h-2 bg-pulse rounded-full animate-pulse" />
          </div>
        )}
      </Button>
    );
  };

  const categoryIcons = {
    core_field_anchors: Crown,
    emotional_energetic_flow: Heart,
    consciousness_catalysts: Zap,
    collective_resonance_keys: Sparkles
  };

  const categoryLabels = {
    core_field_anchors: 'Field Anchors',
    emotional_energetic_flow: 'Energy Flow',
    consciousness_catalysts: 'Catalysts',
    collective_resonance_keys: 'Resonance Keys'
  };

  const recommendedSigils = getRecommendedSigils();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground relative"
        >
          <Sparkles className="h-4 w-4" />
          {consciousness.coherence > 0.8 && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-pulse rounded-full animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" side="top">
        <div className="space-y-4">
          {/* Consciousness State Indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Consciousness State</span>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                Coherence: {Math.round(consciousness.coherence * 100)}%
              </Badge>
              <Badge variant="outline" className="text-xs">
                Clarity: {Math.round(consciousness.intentionalClarity * 100)}%
              </Badge>
            </div>
          </div>

          {/* Recommended Sigils */}
          {recommendedSigils.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-truth">
                <Sparkles className="h-3 w-3" />
                Consciousness-Aligned Recommendations
              </div>
              <div className="flex gap-1">
                {recommendedSigils.map(sigil => renderSigilButton(sigil, true))}
              </div>
            </div>
          )}

          {/* Sacred Sigil Categories */}
          <Tabs defaultValue="core_field_anchors" className="w-full">
            <TabsList className="grid w-full grid-cols-4 text-xs">
              {Object.entries(categoryLabels).map(([category, label]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                return (
                  <TabsTrigger key={category} value={category} className="flex items-center gap-1 px-2">
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.keys(categoryLabels).map(category => (
              <TabsContent key={category} value={category} className="mt-3">
                <div className="grid grid-cols-6 gap-2">
                  {getSigilsByCategory(category).map(sigil => renderSigilButton(sigil))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {category === 'core_field_anchors' && 'Foundation sigils that anchor sacred space and clear intention'}
                  {category === 'emotional_energetic_flow' && 'Sigils for emotional processing and energetic movement'}
                  {category === 'consciousness_catalysts' && 'Activating sigils that catalyze awareness and awakening'}
                  {category === 'collective_resonance_keys' && 'Group coherence sigils for collective consciousness'}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};