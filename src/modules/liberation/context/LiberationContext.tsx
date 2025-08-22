import React, { createContext, useContext } from 'react';
import { ActorRefFrom } from 'xstate';
import { liberationMachine } from '../machine';

interface LiberationContextValue {
  state: any;
  send: any;
}

const LiberationContext = createContext<LiberationContextValue | null>(null);

export const LiberationProvider: React.FC<{
  value: LiberationContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <LiberationContext.Provider value={value}>
    {children}
  </LiberationContext.Provider>
);

export const useLiberationState = () => {
  const context = useContext(LiberationContext);
  if (!context) {
    throw new Error('useLiberationState must be used within LiberationProvider');
  }
  return context;
};