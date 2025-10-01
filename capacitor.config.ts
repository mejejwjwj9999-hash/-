import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.611d08f2eedf4235904d142019b9b499',
  appName: 'aylol-site-scribe-03-55',
  webDir: 'dist',
  server: {
    url: 'https://611d08f2-eedf-4235-904d-142019b9b499.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e3a8a',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e3a8a'
    }
  }
};

export default config;