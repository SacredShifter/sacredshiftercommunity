import React from 'react';

const ShiftPageSkeleton = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-48"></div>
        <div className="h-4 bg-gray-300 rounded w-64 mt-2"></div>
      </div>
    </div>
  );
};

export default ShiftPageSkeleton;
