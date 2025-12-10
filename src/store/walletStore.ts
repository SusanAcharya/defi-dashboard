import { create } from 'zustand';
import { Wallet, Settings } from '@/types';

interface WalletState {
  wallet: Wallet | null;
  isConnected: boolean;
  settings: Settings;
  
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  telegramAlerts: false,
  pushNotifications: true,
  currency: 'USD',
  theme: 'dark',
  language: 'en',
};

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  isConnected: false,
  settings: defaultSettings,
  
  connectWallet: (address) => set({
    wallet: {
      address,
      shortAddress: `${address.slice(0, 6)}...${address.slice(-4)}`,
    },
    isConnected: true,
  }),
  
  disconnectWallet: () => set({
    wallet: null,
    isConnected: false,
  }),
  
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings },
  })),
}));

