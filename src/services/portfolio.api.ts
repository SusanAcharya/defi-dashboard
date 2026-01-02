import { Portfolio } from '@/types';
import { apiClient } from './client';

export async function getPortfolio(walletAddress?: string | null): Promise<Portfolio> {
  const endpoint = walletAddress ? `/portfolio/${walletAddress}` : '/portfolio';
  return apiClient.get<Portfolio>(endpoint);
}

export async function getPortfolioChartData(
  walletAddress?: string | null,
  timeframe: string = '30D'
): Promise<Array<{ date: string; value: number }>> {
  const endpoint = walletAddress ? `/portfolio/${walletAddress}/chart` : '/portfolio/chart';
  return apiClient.get(endpoint, { timeframe });
}
