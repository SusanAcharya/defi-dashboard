import { LeaderboardEntry } from '@/types';
import { apiClient } from './client';

export async function getLeaderboard(tab: string = 'global'): Promise<LeaderboardEntry[]> {
  return apiClient.get<LeaderboardEntry[]>('/leaderboard', { tab });
}
