import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'app',
  webDir: 'src',
  server: {
    androidScheme: 'https'
  }
};

export default config;
