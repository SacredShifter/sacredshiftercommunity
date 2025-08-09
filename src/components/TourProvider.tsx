import React, { ReactNode } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useTour } from '@/hooks/useTour';
import { TourContext } from '@/hooks/useTourContext';

interface TourProviderProps {
  children: ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const tourHook = useTour();
  const { 
    activeTour, 
    tourIndex, 
    isRunning, 
    completeTour, 
    skipTour,
    setTourIndex 
  } = tourHook;

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    // Update the current step index
    if (action === 'update' && type === 'step:after') {
      setTourIndex(index + 1);
    }

    // Handle tour completion
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      if (status === STATUS.FINISHED) {
        completeTour();
      } else {
        skipTour();
      }

      // Reset scroll and overflow styles
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }, 100);
    }
  };

  return (
    <TourContext.Provider value={tourHook}>
      {children}
      {activeTour && (
        <Joyride
          steps={activeTour.steps}
          run={isRunning}
          stepIndex={tourIndex}
          callback={handleJoyrideCallback}
          continuous={activeTour.continuous ?? true}
          showProgress={activeTour.showProgress ?? true}
          showSkipButton={activeTour.showSkipButton ?? true}
          disableOverlay={activeTour.disableOverlay ?? false}
          disableScrolling={false}
          scrollToFirstStep={false}
          disableScrollParentFix={true}
          styles={{
            options: {
              primaryColor: 'hsl(var(--primary))',
              backgroundColor: 'hsl(var(--background))',
              textColor: 'hsl(var(--foreground))',
              overlayColor: 'rgba(0, 0, 0, 0.5)',
              arrowColor: 'hsl(var(--background))',
              zIndex: 10000,
            },
            tooltip: {
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              fontFamily: 'inherit',
            },
            buttonNext: {
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontWeight: '500',
            },
            buttonBack: {
              color: 'hsl(var(--muted-foreground))',
              marginRight: '8px',
            },
            buttonSkip: {
              color: 'hsl(var(--muted-foreground))',
            },
            buttonClose: {
              color: 'hsl(var(--muted-foreground))',
            }
          }}
        />
      )}
    </TourContext.Provider>
  );
};