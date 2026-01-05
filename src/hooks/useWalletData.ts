/**
 * useWalletData Hook
 * Provides easy access to wallet data from the API
 */

import { useState, useCallback } from 'react';
import { walletAPI, WalletDetailsResponse, TimeRange, Transaction } from '@/services/wallet.api';

interface UseWalletDataReturn {
  walletDetails: WalletDetailsResponse['data'] | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchWalletDetails: (address: string, timeRange?: TimeRange) => Promise<void>;
  fetchTransactions: (address: string, timeRange?: TimeRange) => Promise<void>;
  fetchAllTransactions: (address: string) => Promise<void>;
}

export const useWalletData = (): UseWalletDataReturn => {
  const [walletDetails, setWalletDetails] = useState<WalletDetailsResponse['data'] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletDetails = useCallback(async (address: string, timeRange: TimeRange = 'all') => {
    setLoading(true);
    setError(null);
    try {
      const response = await walletAPI.getWalletDetails(address, { timeRange });
      setWalletDetails(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch wallet details';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (address: string, timeRange: TimeRange = 'all') => {
    setLoading(true);
    setError(null);
    try {
      const response = await walletAPI.getTransactionHistory(address, { timeRange });
      setTransactions(response.data.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllTransactions = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);
    try {
      const allTransactions = await walletAPI.getAllTransactions(address);
      setTransactions(allTransactions);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch all transactions';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    walletDetails,
    transactions,
    loading,
    error,
    fetchWalletDetails,
    fetchTransactions,
    fetchAllTransactions,
  };
};
