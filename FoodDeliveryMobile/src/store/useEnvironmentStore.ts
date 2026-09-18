import { create } from 'zustand';
import { Platform } from 'react-native';

interface EnvironmentState {
  baseUrl: string;
  getBaseUrl: () => string;
  setBaseUrl: (url: string) => void;
}

// Automatically routes to local NestJS backend on port 3000:
// - iOS Simulator: http://localhost:3000
// - Android Emulator: http://10.0.2.2:3000
const DEFAULT_BASE_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

export const useEnvironmentStore = create<EnvironmentState>((set, get) => ({
  baseUrl: DEFAULT_BASE_URL,
  getBaseUrl: () => get().baseUrl,
  setBaseUrl: (baseUrl: string) => set({ baseUrl }),
}));
