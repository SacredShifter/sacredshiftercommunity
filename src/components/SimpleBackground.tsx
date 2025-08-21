import React from 'react';

export const SimpleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -10 }}>
      {/* Base cosmic gradient - solid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/15" />
      
      {/* Additional gradient layers for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/5 via-transparent to-primary/5" />
      <div className="absolute inset-0 bg-gradient-radial from-center from-primary/15 via-transparent to-transparent" />
      
      {/* Floating orbs with better coverage */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/25 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-10 w-64 h-64 bg-accent/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-10 left-20 w-72 h-72 bg-primary/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s' }} />
      
      {/* Bottom gradient fade for polished look */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/95 to-transparent" />
    </div>
  );
};

export default SimpleBackground;