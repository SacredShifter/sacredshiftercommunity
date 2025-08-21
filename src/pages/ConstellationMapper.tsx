import React from 'react';
import { ConsciousnessConstellationMapper } from '@/components/ConsciousnessConstellationMapper';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ConstellationMapper() {
  return (
    <ProtectedRoute>
      <div className="h-full p-6">
        <div className="max-w-7xl mx-auto">
          <ConsciousnessConstellationMapper />
        </div>
      </div>
    </ProtectedRoute>
  );
}