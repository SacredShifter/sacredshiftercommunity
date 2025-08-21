import React from 'react';
import { SacredGrove } from "@/components/SacredGrove/SacredGrove";
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Grove() {
  return (
    <ProtectedRoute>
      <div className="h-full">
        <SacredGrove isVisible={true} onClose={() => {}} />
      </div>
    </ProtectedRoute>
  );
}