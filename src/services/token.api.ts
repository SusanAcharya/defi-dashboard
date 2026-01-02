import { Token } from '@/types';
import { apiClient } from './client';

export async function getTokens(walletAddress?: string | null): Promise<Token[]> {
  const endpoint = walletAddress ? `/tokens/${walletAddress}` : '/tokens';
  return apiClient.get<Token[]>(endpoint);
}
