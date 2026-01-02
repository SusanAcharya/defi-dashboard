import { LiquidityPool } from '@/types';
import { apiClient } from './client';

export async function getLiquidityPools(): Promise<LiquidityPool[]> {
  return apiClient.get<LiquidityPool[]>('/liquidity-pools');
}
