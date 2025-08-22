import React, { createContext, useContext } from 'react';

interface EarthContextValue {
  state: any;
  send: any;
  onExit: () => void;
}

const EarthContext = createContext<EarthContextValue | null>(null);

export const EarthProvider: React.FC<{
  value: EarthContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <EarthContext.Provider value={value}>
    {children}
  </EarthContext.Provider>
);

export const useEarthState = () => {
  const context = useContext(EarthContext);
  if (!context) {
    throw new Error('useEarthState must be used within EarthProvider');
  }
  return context;
};