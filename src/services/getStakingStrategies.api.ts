import { StakingStrategy } from '@/types';
import { apiClient } from './client';

export async function getStakingStrategies(): Promise<StakingStrategy[]> {
  return apiClient.get<StakingStrategy[]>('/staking-strategies');
}
