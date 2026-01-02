import { DefiPosition } from '@/types';
import { apiClient } from './client';

export async function getDefiPositions(walletAddress?: string | null): Promise<DefiPosition[]> {
  const endpoint = walletAddress ? `/defi-positions/${walletAddress}` : '/defi-positions';
  return apiClient.get<DefiPosition[]>(endpoint);
}
