/**
 * Wallet API Service
 * Handles wallet data retrieval and transaction history
 */

import { apiClient } from './client';

export type TimeRange = '1d' | '1w' | '1m' | '1y' | 'all';

export interface Token {
  address: string;
  symbol: string;
  balance: string;
  decimals: number;
  lastUpdated: string;
}

export interface WalletSubscription {
  name: string;
  walletAddress: string;
}

export interface User {
  walletAddress: string;
  telegramId?: string;
  tokens: Token[];
  subscribed: WalletSubscription[];
  startBlock: number;
  currentBlockNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface GraphDataPoint {
  timestamp: string;
  tokenAddress: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface WalletDetailsResponse {
  success: boolean;
  data: {
    user: User;
    graphData: {
      data: GraphDataPoint[];
      pagination: Pagination;
    };
  };
}

export interface Transaction {
  blockNumber: number;
  transactionHash: string;
  eventIndex: number;
  timestamp: string;
  from: string;
  to: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  amount: string;
  decimals: number;
  type: 'sent' | 'received';
}

export interface TransactionHistoryResponse {
  success: boolean;
  data: {
    data: Transaction[];
    pagination: Pagination;
  };
}

export interface SubscribedWalletsResponse {
  success: boolean;
  data: {
    subscribed: WalletSubscription[];
  };
}

export const walletAPI = {
  /**
   * Get wallet details and balance history
   */
  getWalletDetails: async (
    address: string,
    options?: {
      timeRange?: TimeRange;
      page?: number;
      limit?: number;
    }
  ): Promise<WalletDetailsResponse> => {
    const response = await apiClient.get<WalletDetailsResponse>(`/wallet/${address}`, {
      timeRange: options?.timeRange,
      page: options?.page,
      limit: options?.limit,
    });
    return response;
  },

  /**
   * Get transaction history for a wallet
   */
  getTransactionHistory: async (
    address: string,
    options?: {
      timeRange?: TimeRange;
      page?: number;
      limit?: number;
      tokenAddress?: string;
    }
  ): Promise<TransactionHistoryResponse> => {
    const response = await apiClient.get<TransactionHistoryResponse>(`/wallet/${address}/transactions`, {
      timeRange: options?.timeRange,
      page: options?.page,
      limit: options?.limit,
      tokenAddress: options?.tokenAddress,
    });
    return response;
  },

  /**
   * Get all transactions with pagination
   */
  getAllTransactions: async (
    address: string,
    onProgress?: (data: Transaction[]) => void
  ): Promise<Transaction[]> => {
    let page = 1;
    let hasMore = true;
    const allTransactions: Transaction[] = [];
    const limit = 100;

    while (hasMore) {
      try {
        const response = await walletAPI.getTransactionHistory(address, {
          page,
          limit,
        });

        allTransactions.push(...response.data.data);
        onProgress?.(response.data.data);

        hasMore = response.data.pagination.hasNext;
        page++;
      } catch (error) {
        console.error(`Error fetching transactions page ${page}:`, error);
        break;
      }
    }

    return allTransactions;
  },

  /**
   * Get subscribed wallets for a wallet address
   */
  getSubscribedWallets: async (walletAddress: string): Promise<WalletSubscription[]> => {
    try {
      const response = await walletAPI.getWalletDetails(walletAddress);
      const mainWallet = response.data.user.walletAddress.toLowerCase();
      
      return response.data.user.subscribed.filter(
        (wallet) => wallet.walletAddress.toLowerCase() !== mainWallet
      );
    } catch (error) {
      console.error('Failed to fetch subscribed wallets:', error);
      return [];
    }
  },

  /**
   * Add a subscribed wallet
   */
  addSubscribedWallet: async (
    walletAddress: string,
    subscribedAddress: string,
    name: string
  ): Promise<{ success: boolean; data?: any }> => {
    const response = await apiClient.post<{ success: boolean; data?: any }>(`/auth/subscribed/add`, {
      walletAddress: walletAddress,
      subscribedAddress: subscribedAddress,
      name: name,
    });
    return response;
  },

  /**
   * Remove a subscribed wallet
   */
  removeSubscribedWallet: async (
    walletAddress: string,
    subscribedAddress: string
  ): Promise<{ success: boolean; data?: any }> => {
    const response = await apiClient.post<{ success: boolean; data?: any }>(`/auth/subscribed/remove`, {
      walletAddress: walletAddress,
      subscribedAddress: subscribedAddress,
    });
    return response;
  },

  /**
   * Get tokens for a wallet
   */
  getWalletTokens: async (walletAddress: string): Promise<Token[]> => {
    const response = await walletAPI.getWalletDetails(walletAddress);
    return response.data.user.tokens || [];
  },
};
