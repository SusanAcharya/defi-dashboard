import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, WalletNotificationSettings } from '@/types';

export interface TrackedWallet {
  address: string;
  shortAddress: string;
  name: string;
  isMine: boolean; // true if user's wallet, false if tracking someone else's
}

interface WalletState {
  settings: Settings;
  walletNotificationSettings: WalletNotificationSettings[];
  username: string;
  alias: string;
  wallets: TrackedWallet[];
  selectedWalletAddress: string | null; // null = show all my wallets combined
  isGuest: boolean; // true for guest mode, false for logged in users
  
  updateSettings: (settings: Partial<Settings>) => void;
  updateWalletNotificationSettings: (address: string, settings: Partial<WalletNotificationSettings>) => void;
  getWalletNotificationSettings: (address: string) => WalletNotificationSettings | undefined;
  updateProfile: (username?: string, alias?: string) => void;
  addWallet: (address: string, name: string, isMine: boolean) => void;
  removeWallet: (address: string) => void;
  updateWallet: (address: string, updates: Partial<TrackedWallet>) => void;
  setSelectedWallet: (address: string | null) => void;
  loginWithTelegram: () => void;
  clearAllWallets: () => void;
}

const defaultSettings: Settings = {
  telegramAlerts: false,
  pushNotifications: true,
  notifyTransactions: true,
  notifyReceives: true,
  notifySends: true,
  notifyAirdrops: true,
  notifyStaking: true,
  notifyLending: true,
  notifySwaps: true,
  notifyNFTs: true,
};

const createDefaultWalletNotificationSettings = (address: string): WalletNotificationSettings => ({
  address,
  enabled: true,
  notifyTransactions: true,
  notifyReceives: true,
  notifySends: true,
  notifyAirdrops: true,
  notifyStaking: true,
  notifyLending: true,
  notifySwaps: true,
  notifyNFTs: true,
  notifyProtocols: {
    'JediSwap': true,
    '10KSwap': true,
    'Ekubo': true,
    'zkLend': true,
  },
  notifyContractInteractions: true,
  notifyFailedTransactions: true,
  notifyPendingTransactions: true,
});

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      walletNotificationSettings: [],
      username: '',
      alias: '',
      wallets: [],
      selectedWalletAddress: null,
      isGuest: true, // Start as guest by default
  
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings },
  })),
  
  updateWalletNotificationSettings: (address, newSettings) => set((state) => {
    const existingIndex = state.walletNotificationSettings.findIndex(w => w.address === address);
    if (existingIndex >= 0) {
      const updated = [...state.walletNotificationSettings];
      updated[existingIndex] = { ...updated[existingIndex], ...newSettings };
      return { walletNotificationSettings: updated };
    } else {
      // Create new wallet notification settings if it doesn't exist
      const newWalletSettings = createDefaultWalletNotificationSettings(address);
      return {
        walletNotificationSettings: [...state.walletNotificationSettings, { ...newWalletSettings, ...newSettings }],
      };
    }
  }),
  
  getWalletNotificationSettings: (address) => {
    const state = get();
    return state.walletNotificationSettings.find(w => w.address === address);
  },
  
  updateProfile: (username, alias) => set((state) => ({
    username: username ?? state.username,
    alias: alias ?? state.alias,
  })),
  
  addWallet: (address, name, isMine) => set((state) => {
    // Check if wallet already exists
    if (state.wallets.some(w => w.address.toLowerCase() === address.toLowerCase())) {
      // Wallet exists, but still set isGuest to false (user is logging in again)
      return { isGuest: false };
    }
    const newWallet: TrackedWallet = {
      address,
      shortAddress: `${address.slice(0, 4)}...${address.slice(-4)}`,
      name,
      isMine,
    };
    // Create default notification settings for the new wallet
    const newWalletNotificationSettings = createDefaultWalletNotificationSettings(address);
    return {
      isGuest: false, // Set logged in when wallet is added
      wallets: [...state.wallets, newWallet],
      walletNotificationSettings: [...state.walletNotificationSettings, newWalletNotificationSettings],
    };
  }),
  
  removeWallet: (address) => set((state) => ({
    wallets: state.wallets.filter(w => w.address !== address),
    walletNotificationSettings: state.walletNotificationSettings.filter(w => w.address !== address),
    selectedWalletAddress: state.selectedWalletAddress === address ? null : state.selectedWalletAddress,
  })),
  
  updateWallet: (address, updates) => set((state) => ({
    wallets: state.wallets.map(w => 
      w.address === address ? { ...w, ...updates } : w
    ),
  })),
  
  setSelectedWallet: (address) => set({ selectedWalletAddress: address }),
  
  loginWithTelegram: () => set((state) => ({
    // Mark user as logged in - wallet data comes from connecting wallets
    isGuest: false,
    // Keep existing wallets and settings
    wallets: state.wallets,
    walletNotificationSettings: state.walletNotificationSettings,
  })),
  
  clearAllWallets: () => set(() => ({
    isGuest: true,
    wallets: [],
    walletNotificationSettings: [],
    selectedWalletAddress: null,
  })),
    }),
    {
      name: 'wallet-store', // key in localStorage
      partialize: (state) => ({
        selectedWalletAddress: state.selectedWalletAddress,
        isGuest: state.isGuest,
        username: state.username,
        alias: state.alias,
        wallets: state.wallets,
        walletNotificationSettings: state.walletNotificationSettings,
      }), // persist login state and wallet data
      onRehydrateStorage: () => (state, action) => {
        if (action === 'REHYDRATE' && state) {
          // Ensure notification settings match wallets
          if (state.wallets.length > 0) {
            const walletAddresses = new Set(state.wallets.map(w => w.address));
            state.walletNotificationSettings = state.walletNotificationSettings.filter(
              ns => walletAddresses.has(ns.address)
            );
          }
        }
      }
    }
  )
);

