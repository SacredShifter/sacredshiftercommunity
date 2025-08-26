import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

const FONT_SIZES = ['text-sm', 'text-base', 'text-lg', 'text-xl'];
const DEFAULT_SIZE_INDEX = 1;

const FontSizeToggle: React.FC = () => {
  const [currentSizeIndex, setCurrentSizeIndex] = useState(DEFAULT_SIZE_INDEX);

  useEffect(() => {
    const root = document.documentElement;
    // Remove all possible font size classes
    FONT_SIZES.forEach(size => root.classList.remove(size));
    // Add the current one
    root.classList.add(FONT_SIZES[currentSizeIndex]);
  }, [currentSizeIndex]);

  const increaseFontSize = () => {
    setCurrentSizeIndex(prev => Math.min(prev + 1, FONT_SIZES.length - 1));
  };

  const decreaseFontSize = () => {
    setCurrentSizeIndex(prev => Math.max(prev - 1, 0));
  };

  const resetFontSize = () => {
    setCurrentSizeIndex(DEFAULT_SIZE_INDEX);
  };

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={decreaseFontSize} disabled={currentSizeIndex === 0} title="Decrease font size">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={resetFontSize} disabled={currentSizeIndex === DEFAULT_SIZE_INDEX} title="Reset font size">
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={increaseFontSize} disabled={currentSizeIndex === FONT_SIZES.length - 1} title="Increase font size">
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FontSizeToggle;
