import React from 'react';
import { CollectiveAkashicConstellation } from '@/components/CollectiveAkashicConstellation/CollectiveAkashicConstellation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CollectiveAkashicConstellationPage() {
  return (
    <ProtectedRoute>
      <CollectiveAkashicConstellation />
    </ProtectedRoute>
  );
}