import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.da56c97a335543d7807a390d8ed20bcd',
  appName: 'sacredshiftercommunity',
  webDir: 'dist',
  server: {
    url: 'https://da56c97a-3355-43d7-807a-390d8ed20bcd.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: true,
      spinnerColor: "#8B5CF6"
    }
  }
};

export default config;