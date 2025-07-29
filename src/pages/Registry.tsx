import React from 'react';
import { RegistryList } from '@/components/RegistryOfResonance/RegistryList';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Registry() {
  return (
    <ProtectedRoute>
      <RegistryList />
    </ProtectedRoute>
  );
}