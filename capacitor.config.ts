import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ejemplo.app',
  appName: 'app',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
