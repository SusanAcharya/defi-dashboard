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

    while (hasMore) {
      const response = await walletAPI.getTransactionHistory(address, {
        page,
        limit: 100,
      });

      allTransactions.push(...response.data.data);
      if (onProgress) {
        onProgress(response.data.data);
      }

      hasMore = response.data.pagination.hasNext;
      page++;
    }

    return allTransactions;
  },

  /**
   * Get subscribed wallets for a wallet address
   */
  getSubscribedWallets: async (walletAddress: string): Promise<WalletSubscription[]> => {
    const response = await walletAPI.getWalletDetails(walletAddress);
    const mainWalletAddress = response.data.user.walletAddress.toLowerCase();
    const subscribed = response.data.user.subscribed;
    
    // Filter to return only subscribed wallets that are NOT the main wallet address
    const uniqueSubscribed = subscribed.filter((wallet) => {
      return wallet.walletAddress.toLowerCase() !== mainWalletAddress;
    });
    
    return uniqueSubscribed;
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
};
