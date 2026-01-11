import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.inaiproject.chat',
  appName: 'InAI Chat',
  webDir: '.next',
  server: {
    // В production используем опубликованный URL
    url: 'https://inaiproject.vercel.app',
    cleartext: false,
    // Для локальной разработки раскомментируйте:
    // url: 'http://localhost:3000',
    // cleartext: true,
  },
  ios: {
    // Настройки для iOS
    contentInset: 'automatic',
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
