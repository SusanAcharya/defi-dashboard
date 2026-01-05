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

export async function getActivities(walletAddress?: string | null): Promise<Activity[]> {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  const response = await apiClient.get<TransactionResponse>(
    `/wallet/${walletAddress}/transactions`,
    { timeRange: '1m', limit: 50 }
  );

  if (!response.success) {
    throw new Error('Failed to fetch activities');
  }

  // Transform transactions to activities
  return response.data.data.map((tx) => ({
    id: tx.transactionHash,
    type: tx.type === 'sent' ? 'transfer' : 'transfer' as any,
    title: `${tx.type === 'sent' ? 'Send' : 'Receive'} ${tx.tokenSymbol}`,
    description: `${tx.type === 'sent' ? 'To' : 'From'}: ${tx.to || tx.from}`,
    timestamp: new Date(tx.timestamp).getTime(),
    amount: parseInt(tx.amount) / Math.pow(10, tx.decimals),
  }));
}
