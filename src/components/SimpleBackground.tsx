import React from 'react';

export const SimpleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -10 }}>
      {/* Base cosmic gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
    </div>
  );
};

export default SimpleBackground;