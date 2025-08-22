import React, { createContext, useContext } from 'react';

interface CollectiveContextValue {
  state: any;
  send: any;
  onExit: () => void;
}

const CollectiveContext = createContext<CollectiveContextValue | null>(null);

export const CollectiveProvider: React.FC<{
  value: CollectiveContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <CollectiveContext.Provider value={value}>
    {children}
  </CollectiveContext.Provider>
);

export const useCollectiveState = () => {
  const context = useContext(CollectiveContext);
  if (!context) {
    throw new Error('useCollectiveState must be used within CollectiveProvider');
  }
  return context;
};