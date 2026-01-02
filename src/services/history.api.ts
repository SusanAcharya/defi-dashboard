import { HistoryEntry } from '@/types';
import { apiClient } from './client';

export async function getHistory(timeframe: '7d' | '30d' = '7d'): Promise<HistoryEntry[]> {
  return apiClient.get<HistoryEntry[]>('/history', { timeframe });
}
