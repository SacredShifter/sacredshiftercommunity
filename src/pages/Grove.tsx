import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SacredGrove } from "@/components/SacredGrove/SacredGrove";
import LearningModule3D from "@/components/3D/LearningModule3D";
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Grove() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  return (
    <ProtectedRoute>
      <div className="h-full">
        {tab === '3d-modules' ? (
          <LearningModule3D />
        ) : (
          <SacredGrove isVisible={true} onClose={() => {}} />
        )}
      </div>
    </ProtectedRoute>
  );
}