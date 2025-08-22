import React, { createContext, useContext } from 'react';

interface UnhookingContextValue {
  state: any;
  send: any;
  onExit: () => void;
}

const UnhookingContext = createContext<UnhookingContextValue | null>(null);

export const UnhookingProvider: React.FC<{
  value: UnhookingContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <UnhookingContext.Provider value={value}>
    {children}
  </UnhookingContext.Provider>
);

export const useUnhookingState = () => {
  const context = useContext(UnhookingContext);
  if (!context) {
    throw new Error('useUnhookingState must be used within UnhookingProvider');
  }
  return context;
};