import { PoolChartData } from '@/types';
import { apiClient } from './client';

export async function getPoolChartData(
  poolId: string,
  metric: 'tvl' | 'volume' | 'fee' | 'apr',
  timeframe: '1w' | '1m' | '1y'
): Promise<PoolChartData[]> {
  return apiClient.get<PoolChartData[]>(`/pools/${poolId}/chart`, { metric, timeframe });
}
