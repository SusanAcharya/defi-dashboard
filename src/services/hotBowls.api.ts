import { HotBowl } from '@/types';
import { apiClient } from './client';

export async function getHotBowls(category?: string): Promise<HotBowl[]> {
  const endpoint = '/hot-bowls';
  return apiClient.get<HotBowl[]>(endpoint, category ? { category } : undefined);
}
