import { PoolTransaction } from '@/types';
import { apiClient } from './client';

export async function getPoolTransactions(poolId: string, type?: string): Promise<PoolTransaction[]> {
  const endpoint = `/pools/${poolId}/transactions`;
  return apiClient.get<PoolTransaction[]>(endpoint, type ? { type } : undefined);
}
