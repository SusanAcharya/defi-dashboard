import { Activity } from '@/types';
import { apiClient } from './client';

interface TransactionData {
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

interface TransactionResponse {
  success: boolean;
  data: {
    data: TransactionData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

/**
 * Get transaction history for a wallet
 * Uses /api/wallet/:address/transactions endpoint
 */
export async function getHistory(
  walletAddress: string,
  timeRange: '1d' | '1w' | '1m' | '1y' | 'all' = '1m'
): Promise<Activity[]> {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  const response = await apiClient.get<TransactionResponse>(
    `/wallet/0x3f239d7344cf4e5e93fbc31da0ec6682d6087fe3a4cde4617dc4a55fb4db0b1/transactions?limit=50`,
    { timeRange, limit: 100 }
  );

  if (!response.success) {
    throw new Error('Failed to fetch transaction history');
  }

  // Transform transactions to Activity format
  return response.data.data.map((tx) => ({
    id: tx.transactionHash,
    type: 'transfer' as const,
    title: `${tx.type === 'sent' ? 'Send' : 'Receive'} ${tx.tokenSymbol}`,
    description: `${tx.type === 'sent' ? 'To' : 'From'}: ${formatAddress(tx.type === 'sent' ? tx.to : tx.from)}`,
    timestamp: new Date(tx.timestamp).getTime(),
    amount: parseInt(tx.amount) / Math.pow(10, tx.decimals),
    token: tx.tokenSymbol,
  }));
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
