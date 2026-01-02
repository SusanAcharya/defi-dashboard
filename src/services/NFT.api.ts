import { NFT } from '@/types';
import { apiClient } from './client';

export async function getNFTs(): Promise<NFT[]> {
  return apiClient.get<NFT[]>('/nfts');
}
