import { apiClient } from './client';
import { TransactionsResponse, Transaction } from '@/types/transaction';

export const transactionAPI = {
  /**
   * Get wallet transactions with pagination
   * @param walletAddress - The wallet address to fetch transactions for
   * @param limit - Number of transactions per page (default: 100, max: 300)
   * @param page - Page number (default: 1)
   * @returns Transactions with pagination info
   */
  getWalletTransactions: async (
    walletAddress: string,
    limit: number = 100,
    page: number = 1
  ): Promise<TransactionsResponse> => {
    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    const response = await apiClient.get<TransactionsResponse>(
      `/wallet/${walletAddress}/transactions`,
      {
        limit: Math.min(limit, 300), // Cap at 300
        page,
      }
    );

    if (!response.success) {
      throw new Error('Failed to fetch transactions');
    }

    return response;
  },

  /**
   * Get all transactions for a wallet (handles pagination)
   * @param walletAddress - The wallet address
   * @param limit - Transactions per page
   * @returns All transactions
   */
  getAllWalletTransactions: async (
    walletAddress: string,
    limit: number = 100
  ): Promise<Transaction[]> => {
    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    let allTransactions: Transaction[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await transactionAPI.getWalletTransactions(
        walletAddress,
        limit,
        currentPage
      );

      allTransactions = allTransactions.concat(response.data.data);
      hasMore = response.data.pagination.hasNext;
      currentPage++;
    }

    return allTransactions;
  },

  /**
   * Get sent transactions only
   * @param walletAddress - The wallet address
   * @param limit - Transactions per page
   * @param page - Page number
   * @returns Sent transactions
   */
  getSentTransactions: async (
    walletAddress: string,
    limit: number = 100,
    page: number = 1
  ): Promise<TransactionsResponse> => {
    const response = await transactionAPI.getWalletTransactions(
      walletAddress,
      limit,
      page
    );

    const sentTransactions = response.data.data.filter(
      (tx) => tx.type === 'sent'
    );

    return {
      ...response,
      data: {
        ...response.data,
        data: sentTransactions,
      },
    };
  },

  /**
   * Get received transactions only
   * @param walletAddress - The wallet address
   * @param limit - Transactions per page
   * @param page - Page number
   * @returns Received transactions
   */
  getReceivedTransactions: async (
    walletAddress: string,
    limit: number = 100,
    page: number = 1
  ): Promise<TransactionsResponse> => {
    const response = await transactionAPI.getWalletTransactions(
      walletAddress,
      limit,
      page
    );

    const receivedTransactions = response.data.data.filter(
      (tx) => tx.type === 'received'
    );

    return {
      ...response,
      data: {
        ...response.data,
        data: receivedTransactions,
      },
    };
  },

  /**
   * Filter transactions by token symbol
   * @param walletAddress - The wallet address
   * @param tokenSymbol - The token symbol to filter by
   * @param limit - Transactions per page
   * @param page - Page number
   * @returns Filtered transactions
   */
  getTransactionsByToken: async (
    walletAddress: string,
    tokenSymbol: string,
    limit: number = 100,
    page: number = 1
  ): Promise<TransactionsResponse> => {
    const response = await transactionAPI.getWalletTransactions(
      walletAddress,
      limit,
      page
    );

    const filtered = response.data.data.filter(
      (tx) => tx.tokenSymbol === tokenSymbol
    );

    return {
      ...response,
      data: {
        ...response.data,
        data: filtered,
      },
    };
  },
};
