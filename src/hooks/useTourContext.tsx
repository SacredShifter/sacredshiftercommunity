import { createContext, useContext } from 'react';
import { useTour, TourConfig } from '@/hooks/useTour';

type TourContextType = ReturnType<typeof useTour>;

export const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTourContext = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTourContext must be used within a TourProvider');
  }
  return context;
};