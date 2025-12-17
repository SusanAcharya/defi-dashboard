import { create } from 'zustand';
import { Wallet, Settings } from '@/types';

interface ConnectedWallet {
  address: string;
  shortAddress: string;
  name?: string;
}

interface WalletState {
  wallet: Wallet | null;
  isConnected: boolean;
  settings: Settings;
  username: string;
  alias: string;
  connectedWallets: ConnectedWallet[];
  
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  updateProfile: (username?: string, alias?: string) => void;
  addWallet: (address: string, name?: string) => void;
  removeWallet: (address: string) => void;
}

const defaultSettings: Settings = {
  telegramAlerts: false,
  pushNotifications: true,
  currency: 'USD',
  theme: 'dark',
  language: 'en',
};

export const useWalletStore = create<WalletState>((set) => ({
  wallet: {
    address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    shortAddress: '0x04...938d',
  },
  isConnected: true,
  settings: defaultSettings,
  username: 'n00dlehead',
  alias: 'Thug',
  connectedWallets: [
    {
      address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
      shortAddress: '0x04...938d',
      name: 'Main Wallet',
    },
  ],
  
  connectWallet: (address) => set((state) => {
    const newWallet = {
      address,
      shortAddress: `${address.slice(0, 4)}...${address.slice(-4)}`,
    };
    return {
      wallet: newWallet,
      isConnected: true,
      connectedWallets: state.connectedWallets.some(w => w.address === address)
        ? state.connectedWallets
        : [...state.connectedWallets, newWallet],
    };
  }),
  
  disconnectWallet: () => set({
    wallet: null,
    isConnected: false,
  }),
  
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings },
  })),
  
  updateProfile: (username, alias) => set((state) => ({
    username: username ?? state.username,
    alias: alias ?? state.alias,
  })),
  
  addWallet: (address, name) => set((state) => {
    const newWallet = {
      address,
      shortAddress: `${address.slice(0, 4)}...${address.slice(-4)}`,
      name,
    };
    return {
      connectedWallets: [...state.connectedWallets, newWallet],
    };
  }),
  
  removeWallet: (address) => set((state) => ({
    connectedWallets: state.connectedWallets.filter(w => w.address !== address),
  })),
}));

