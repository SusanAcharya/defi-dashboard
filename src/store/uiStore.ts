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
  
  // Actions
  setWalletConnectModalOpen: (open: boolean) => void;
  setTokenSelectorModalOpen: (open: boolean) => void;
  setSwapHistoryModalOpen: (open: boolean) => void;
  setAddressBookModalOpen: (open: boolean) => void;
  setTransferDetailModalOpen: (open: boolean) => void;
  setStakeModalOpen: (open: boolean) => void;
  setNftDetailModalOpen: (open: boolean) => void;
  setNotificationDetailModalOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setDesktopSidebarOpen: (open: boolean) => void;
  setSelectedToken: (token: string | null) => void;
  setSelectedTransfer: (transfer: string | null) => void;
  setSelectedNFT: (nft: string | null) => void;
  setSelectedNotification: (notification: string | null) => void;
  toggleFinancialNumbers: () => void;
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
  mobileNavOpen: false,
  desktopSidebarOpen: true,
  selectedToken: null,
  selectedTransfer: null,
  selectedNFT: null,
  selectedNotification: null,
  showFinancialNumbers: true, // Default to showing numbers
  
  setWalletConnectModalOpen: (open) => set({ walletConnectModalOpen: open }),
  setTokenSelectorModalOpen: (open) => set({ tokenSelectorModalOpen: open }),
  setSwapHistoryModalOpen: (open) => set({ swapHistoryModalOpen: open }),
  setAddressBookModalOpen: (open) => set({ addressBookModalOpen: open }),
  setTransferDetailModalOpen: (open) => set({ transferDetailModalOpen: open }),
  setStakeModalOpen: (open) => set({ stakeModalOpen: open }),
  setNftDetailModalOpen: (open) => set({ nftDetailModalOpen: open }),
  setNotificationDetailModalOpen: (open) => set({ notificationDetailModalOpen: open }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  setDesktopSidebarOpen: (open) => set({ desktopSidebarOpen: open }),
  setSelectedToken: (token) => set({ selectedToken: token }),
  setSelectedTransfer: (transfer) => set({ selectedTransfer: transfer }),
  setSelectedNFT: (nft) => set({ selectedNFT: nft }),
  setSelectedNotification: (notification) => set({ selectedNotification: notification }),
  toggleFinancialNumbers: () => set((state) => ({ showFinancialNumbers: !state.showFinancialNumbers })),
  closeAllModals: () => set({
    walletConnectModalOpen: false,
    tokenSelectorModalOpen: false,
    swapHistoryModalOpen: false,
    addressBookModalOpen: false,
    transferDetailModalOpen: false,
    stakeModalOpen: false,
    nftDetailModalOpen: false,
    notificationDetailModalOpen: false,
  }),
}));

