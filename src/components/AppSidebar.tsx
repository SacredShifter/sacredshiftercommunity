import React from 'react';
import { Navigation } from './Navigation';
import FlowerOfLifeIcon from './FlowerOfLifeIcon';
import { Link } from 'react-router-dom';

export const AppSidebar = () => {
  console.log('[AppSidebar] Component rendering');

  React.useEffect(() => {
    console.log('[useEffect] AppSidebar: Component did mount');
    return () => {
      console.log('[useEffect] AppSidebar: Component will unmount');
    };
  }, []);

  try {
    console.log('[AppSidebar] Rendering component UI');
    return (
      <aside className="w-64 flex-shrink-0 border-r border-border/30 p-4 flex flex-col bg-background/10 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-6">
          <Link to="/" className="flex items-center space-x-2">
            <FlowerOfLifeIcon className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg">Sacred Shifter</span>
          </Link>
        </div>
        <Navigation />
      </aside>
    );
  } catch (error) {
    console.error('[AppSidebar] Failed to render component:', error);
    return <div>Error loading sidebar.</div>;
  }
};