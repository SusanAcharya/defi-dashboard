import { Airdrop } from '@/types';
import { apiClient } from './client';

export async function getAirdrops(): Promise<Airdrop[]> {
  return apiClient.get<Airdrop[]>('/airdrops');
}
