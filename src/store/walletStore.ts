import { create } from 'zustand';
import { Settings } from '@/types';

export interface TrackedWallet {
  address: string;
  shortAddress: string;
  name: string;
  isMine: boolean; // true if user's wallet, false if tracking someone else's
}

interface WalletState {
  settings: Settings;
  username: string;
  alias: string;
  wallets: TrackedWallet[];
  selectedWalletAddress: string | null; // null = show all my wallets combined
  
  updateSettings: (settings: Partial<Settings>) => void;
  updateProfile: (username?: string, alias?: string) => void;
  addWallet: (address: string, name: string, isMine: boolean) => void;
  removeWallet: (address: string) => void;
  updateWallet: (address: string, updates: Partial<TrackedWallet>) => void;
  setSelectedWallet: (address: string | null) => void;
}

const defaultSettings: Settings = {
  telegramAlerts: false,
  pushNotifications: true,
  currency: 'USD',
  theme: 'dark',
  language: 'en',
};

export const useWalletStore = create<WalletState>((set) => ({
  settings: defaultSettings,
  username: 'n00dlehead',
  alias: 'Thug',
  wallets: [
    {
      address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
      shortAddress: '0x04...938d',
      name: 'Main Wallet',
      isMine: true,
    },
    {
      address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      shortAddress: '0x049...dc7',
      name: 'Trading Wallet',
      isMine: true,
    },
    {
      address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
      shortAddress: '0x053...8a8',
      name: 'Whale Tracker',
      isMine: false,
    },
  ],
  selectedWalletAddress: null, // null = show all my wallets combined
  
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings },
  })),
  
  updateProfile: (username, alias) => set((state) => ({
    username: username ?? state.username,
    alias: alias ?? state.alias,
  })),
  
  addWallet: (address, name, isMine) => set((state) => {
    // Check if wallet already exists
    if (state.wallets.some(w => w.address.toLowerCase() === address.toLowerCase())) {
      return state;
    }
    const newWallet: TrackedWallet = {
      address,
      shortAddress: `${address.slice(0, 4)}...${address.slice(-4)}`,
      name,
      isMine,
    };
    return {
      wallets: [...state.wallets, newWallet],
    };
  }),
  
  removeWallet: (address) => set((state) => ({
    wallets: state.wallets.filter(w => w.address !== address),
    selectedWalletAddress: state.selectedWalletAddress === address ? null : state.selectedWalletAddress,
  })),
  
  updateWallet: (address, updates) => set((state) => ({
    wallets: state.wallets.map(w => 
      w.address === address ? { ...w, ...updates } : w
    ),
  })),
  
  setSelectedWallet: (address) => set({ selectedWalletAddress: address }),
}));

