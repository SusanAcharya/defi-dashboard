import { PoolDetail } from '@/types';
import { apiClient } from './client';

export async function getPoolDetail(poolId: string): Promise<PoolDetail> {
  return apiClient.get<PoolDetail>(`/pools/${poolId}`);
}
