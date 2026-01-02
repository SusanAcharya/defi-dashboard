import { StakingPool } from '@/types';
import { apiClient } from './client';

export async function getStakingPools(): Promise<StakingPool[]> {
  return apiClient.get<StakingPool[]>('/staking-pools');
}
