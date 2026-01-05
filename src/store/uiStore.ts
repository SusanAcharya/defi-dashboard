import { create } from 'zustand';

interface UIState {
  // Modals
  walletConnectModalOpen: boolean;
  tokenSelectorModalOpen: boolean;
  swapHistoryModalOpen: boolean;
  addressBookModalOpen: boolean;
  transferDetailModalOpen: boolean;
  stakeModalOpen: boolean;
  nftDetailModalOpen: boolean;
  notificationDetailModalOpen: boolean;
  telegramConnectModalOpen: boolean;
  
  // Drawers/Sidebars
  mobileNavOpen: boolean;
  desktopSidebarOpen: boolean;
  
  // Selected items
  selectedToken: string | null;
  selectedTransfer: string | null;
  selectedNFT: string | null;
  selectedNotification: string | null;
  
  // Privacy toggle
  showFinancialNumbers: boolean;
  
  // Streak and Check-in
  streak: number;
  lastCheckIn: number | null;
  checkedInToday: boolean;
  checkInHistory: number[]; // Array of timestamps for check-ins
  referralCode: string;
  referredFriends: number;
  
  // Actions
  setWalletConnectModalOpen: (open: boolean) => void;
  setTokenSelectorModalOpen: (open: boolean) => void;
  setSwapHistoryModalOpen: (open: boolean) => void;
  setAddressBookModalOpen: (open: boolean) => void;
  setTransferDetailModalOpen: (open: boolean) => void;
  setStakeModalOpen: (open: boolean) => void;
  setNftDetailModalOpen: (open: boolean) => void;
  setNotificationDetailModalOpen: (open: boolean) => void;
  setTelegramConnectModalOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setDesktopSidebarOpen: (open: boolean) => void;
  setSelectedToken: (token: string | null) => void;
  setSelectedTransfer: (transfer: string | null) => void;
  setSelectedNFT: (nft: string | null) => void;
  setSelectedNotification: (notification: string | null) => void;
  toggleFinancialNumbers: () => void;
  checkIn: () => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  walletConnectModalOpen: false,
  tokenSelectorModalOpen: false,
  swapHistoryModalOpen: false,
  addressBookModalOpen: false,
  transferDetailModalOpen: false,
  stakeModalOpen: false,
  nftDetailModalOpen: false,
  notificationDetailModalOpen: false,
  telegramConnectModalOpen: false,
  mobileNavOpen: false,
  desktopSidebarOpen: true,
  selectedToken: null,
  selectedTransfer: null,
  selectedNFT: null,
  selectedNotification: null,
  showFinancialNumbers: true, // Default to showing numbers
  streak: 0,
  lastCheckIn: null,
  checkedInToday: false,
  checkInHistory: [],
  referralCode: 'KMPASS2024',
  referredFriends: 0,
  
  setWalletConnectModalOpen: (open) => set({ walletConnectModalOpen: open }),
  setTokenSelectorModalOpen: (open) => set({ tokenSelectorModalOpen: open }),
  setSwapHistoryModalOpen: (open) => set({ swapHistoryModalOpen: open }),
  setAddressBookModalOpen: (open) => set({ addressBookModalOpen: open }),
  setTransferDetailModalOpen: (open) => set({ transferDetailModalOpen: open }),
  setStakeModalOpen: (open) => set({ stakeModalOpen: open }),
  setNftDetailModalOpen: (open) => set({ nftDetailModalOpen: open }),
  setNotificationDetailModalOpen: (open) => set({ notificationDetailModalOpen: open }),
  setTelegramConnectModalOpen: (open) => set({ telegramConnectModalOpen: open }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  setDesktopSidebarOpen: (open) => set({ desktopSidebarOpen: open }),
  setSelectedToken: (token) => set({ selectedToken: token }),
  setSelectedTransfer: (transfer) => set({ selectedTransfer: transfer }),
  setSelectedNFT: (nft) => set({ selectedNFT: nft }),
  setSelectedNotification: (notification) => set({ selectedNotification: notification }),
  toggleFinancialNumbers: () => set((state) => ({ showFinancialNumbers: !state.showFinancialNumbers })),
  checkIn: () => set((state) => {
    const now = Date.now();
    const lastCheckIn = state.lastCheckIn;
    const checkedInToday = state.checkedInToday;
    
    // If already checked in today, don't do anything
    if (checkedInToday) {
      return state;
    }
    
    // Get today's timestamp (start of day)
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    // Check if already checked in today (in case of multiple check-ins)
    if (state.checkInHistory.includes(todayTimestamp)) {
      return state;
    }
    
    // Check if last check-in was yesterday (within 24-48 hours) to maintain streak
    // or if it's been more than 48 hours (reset streak)
    let newStreak = state.streak;
    if (lastCheckIn) {
      const lastCheckInDate = new Date(lastCheckIn);
      lastCheckInDate.setHours(0, 0, 0, 0);
      const lastCheckInTimestamp = lastCheckInDate.getTime();
      
      // Check if last check-in was yesterday (exactly 1 day ago)
      const yesterdayTimestamp = todayTimestamp - (24 * 60 * 60 * 1000);
      
      if (lastCheckInTimestamp === yesterdayTimestamp) {
        // Consecutive day, increment streak
        newStreak = state.streak + 1;
      } else if (lastCheckInTimestamp < yesterdayTimestamp) {
        // More than 1 day ago, reset streak to 1
        newStreak = 1;
      } else {
        // Same day (shouldn't happen, but just in case)
        newStreak = state.streak;
      }
    } else {
      // First check-in
      newStreak = 1;
    }
    
    // Add today's timestamp to history
    const newHistory = [...state.checkInHistory, todayTimestamp];
    
    return {
      streak: newStreak,
      lastCheckIn: now,
      checkedInToday: true,
      checkInHistory: newHistory,
    };
  }),
  closeAllModals: () => set({
    walletConnectModalOpen: false,
    tokenSelectorModalOpen: false,
    swapHistoryModalOpen: false,
    addressBookModalOpen: false,
    transferDetailModalOpen: false,
    stakeModalOpen: false,
    nftDetailModalOpen: false,
    notificationDetailModalOpen: false,
    telegramConnectModalOpen: false,
  }),
}));

