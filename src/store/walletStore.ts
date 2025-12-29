import { create } from 'zustand';
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
  logout: () => void;
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

const initialWallets: TrackedWallet[] = [
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
];

const guestWallets: TrackedWallet[] = [];

export const useWalletStore = create<WalletState>((set, get) => ({
  settings: defaultSettings,
  walletNotificationSettings: initialWallets.map(w => createDefaultWalletNotificationSettings(w.address)),
  username: 'n00dlehead',
  alias: 'Thug',
  wallets: initialWallets,
  selectedWalletAddress: null, // null = show all my wallets combined
  isGuest: false, // Start logged in by default
  
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
      return state;
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
  
  loginWithTelegram: () => set({
    // Simulate Telegram login - in real app, this would call Telegram API
    isGuest: false,
    username: 'n00dlehead',
    alias: 'Thug',
    wallets: initialWallets,
    walletNotificationSettings: initialWallets.map(w => createDefaultWalletNotificationSettings(w.address)),
  }),
  
  logout: () => set({
    isGuest: true,
    username: 'Guest',
    alias: '',
    wallets: guestWallets,
    walletNotificationSettings: [],
    selectedWalletAddress: null,
  }),
}));

