import { TourConfig } from '@/hooks/useTour';

export const LANDING_PAGE_TOUR: TourConfig = {
  id: 'landing-page-tour',
  continuous: true,
  showProgress: true,
  showSkipButton: true,
  steps: [
    {
      target: 'body',
      content: 'Welcome to Sacred Shifter! ✨ Let me guide you through the key features and show you how to interact with everything on this platform.',
      title: 'Welcome Tour',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="sacred-shifter-logo"]',
      content: 'Sacred Shifter Hub - This is your spiritual headquarters! Click here anytime to return to the main dashboard.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="navigation-sidebar"]',
      content: 'Navigation Sidebar - Your spiritual toolkit is organized here. Explore different sections like Journal, Circles, and the Video Library.',
      placement: 'right',
    },
    {
      target: '[data-tour="frequency-tiles"]',
      content: 'Frequency Alignment Tiles - These interactive tiles help you align with different frequencies. Click any tile to explore that energy signature.',
      placement: 'top',
    },
    {
      target: '[data-tour="profile-section"]',
      content: 'Your Sacred Profile - Access your profile, settings, and spiritual journey progress here. You can also sign out when needed.',
      placement: 'left',
    },
    {
      target: 'body',
      content: 'You\'re all set! 🙏 Start exploring by clicking on any tile or using the navigation sidebar. Your spiritual journey awaits! Tip: You can restart this tour anytime from your profile settings.',
      title: 'Ready to Begin',
      placement: 'center',
    },
  ],
};

export const NAVIGATION_TOUR: TourConfig = {
  id: 'navigation-tour',
  continuous: true,
  showProgress: true,
  showSkipButton: true,
  steps: [
    {
      target: '[data-tour="nav-home"]',
      content: 'Home Dashboard - Your central hub with frequency tiles and quick access to all features.',
      placement: 'right',
    },
    {
      target: '[data-tour="nav-feed"]',
      content: 'Sacred Feed - Connect with the community, share insights, and discover wisdom from fellow travelers.',
      placement: 'right',
    },
    {
      target: '[data-tour="nav-journal"]',
      content: 'Mirror Journal - Reflect, record, and track your spiritual insights and daily experiences.',
      placement: 'right',
    },
    {
      target: '[data-tour="nav-circles"]',
      content: 'Sacred Circles - Join group discussions, create circles, and connect with like-minded souls.',
      placement: 'right',
    },
    {
      target: '[data-tour="nav-video-library"]',
      content: 'YouTube Library - Curated spiritual content, guided meditations, and transformational videos.',
      placement: 'right',
    },
    {
      target: '[data-tour="nav-codex"]',
      content: 'Sacred Codex - Your knowledge base of spiritual wisdom, practices, and sacred teachings.',
      placement: 'right',
    },
  ],
};

export const FREQUENCY_TILES_TOUR: TourConfig = {
  id: 'frequency-tiles-tour',
  continuous: true,
  showProgress: true,
  showSkipButton: true,
  steps: [
    {
      target: '[data-tour="tile-clickable"]',
      content: 'Interactive Frequency Tiles - Each tile represents a different spiritual frequency or energy center. Click to explore and align with that energy.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="tile-hover-effects"]',
      content: 'Hover for Insights - Hover over any tile to see its energy signature and get a preview of what you\'ll discover inside.',
      placement: 'top',
    },
    {
      target: '[data-tour="tile-sacred-geometry"]',
      content: 'Sacred Geometry - Notice the geometric patterns? Each one represents the energetic blueprint of that frequency.',
      placement: 'left',
    },
  ],
};