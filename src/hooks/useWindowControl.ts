import { useState, useCallback, useRef, useEffect } from 'react';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number | string;
  height: number | string;
}

export interface UseWindowControlProps {
  initialState?: 'minimized' | 'maximized' | 'normal';
  initialPosition?: WindowPosition;
  initialSize?: WindowSize;
  defaultSize?: WindowSize;
}

export const useWindowControl = ({
  initialState = 'normal',
  initialPosition = { x: 0, y: 0 },
  initialSize,
  defaultSize = { width: '400px', height: '600px' }
}: UseWindowControlProps = {}) => {
  const [isMinimized, setIsMinimized] = useState(initialState === 'minimized');
  const [isMaximized, setIsMaximized] = useState(initialState === 'maximized');
  const [position, setPosition] = useState<WindowPosition>(initialPosition);
  const [size, setSize] = useState<WindowSize>(initialSize || defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const previousStateRef = useRef({ size, position });

  // Save previous state before maximizing
  useEffect(() => {
    if (!isMaximized) return;
    previousStateRef.current = {
      size,
      position
    };
  }, [isMaximized, size, position]);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
    if (isMinimized === false) {
      setIsMaximized(false);
    }
  }, [isMinimized]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
    if (!isMaximized) {
      // Save current state before maximizing
      previousStateRef.current = {
        size,
        position
      };
    } else {
      // Restore previous state
      setSize(previousStateRef.current.size);
      setPosition(previousStateRef.current.position);
    }
    setIsMinimized(false);
  }, [isMaximized, size, position]);

  const setNormal = useCallback(() => {
    setIsMinimized(false);
    setIsMaximized(false);
  }, []);

  const startDrag = useCallback(() => {
    if (!isMaximized) {
      setIsDragging(true);
    }
  }, [isMaximized]);

  const stopDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  const updatePosition = useCallback((newPosition: WindowPosition) => {
    if (!isMaximized) {
      setPosition(newPosition);
    }
  }, [isMaximized]);

  const startResize = useCallback((direction: string) => {
    if (!isMaximized && !isMinimized) {
      setIsResizing(true);
      setResizeDirection(direction);
    }
  }, [isMaximized, isMinimized]);

  const stopResize = useCallback(() => {
    setIsResizing(false);
    setResizeDirection(null);
  }, []);

  const updateSize = useCallback((newSize: WindowSize) => {
    if (!isMaximized && !isMinimized) {
      setSize(newSize);
    }
  }, [isMaximized, isMinimized]);

  return {
    isMinimized,
    isMaximized,
    position,
    size,
    isDragging,
    isResizing,
    resizeDirection,
    toggleMinimize,
    toggleMaximize,
    setNormal,
    startDrag,
    stopDrag,
    updatePosition,
    startResize,
    stopResize,
    updateSize
  };
};