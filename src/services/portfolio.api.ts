import { Portfolio } from '@/types';
import { apiClient } from './client';

export async function getPortfolio(walletAddress?: string | null): Promise<Portfolio> {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }
  const response = await apiClient.get<{ success: boolean; data: { user: any; graphData: any } }>(`/wallet/${walletAddress}`);
  
  if (!response.success) {
    throw new Error('Failed to fetch portfolio');
  }

  // Transform API response to match Portfolio interface
  const { graphData } = response.data;
  
  // Calculate total value from balance history
  const latestBalance = graphData?.data?.[0];
  const totalValue = latestBalance ? parseFloat(latestBalance.balance) / Math.pow(10, latestBalance.decimals) : 0;

  return {
    totalValue,
    totalAssets: totalValue,
    totalDebt: 0,
    nftValue: 0,
    protocolRewards: 0,
    pnl24h: 0,
    pnl24hPercent: 0,
  };
}

export async function getPortfolioChartData(
  walletAddress?: string | null,
  timeframe: string = '30D'
): Promise<Array<{ date: string; value: number }>> {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  // Map timeframe names to API timeRange parameter
  const timeRangeMap: { [key: string]: string } = {
    '1D': '1d',
    '7D': '1w',
    '30D': '1m',
    '90D': '1m', // Approximate - API doesn't support 90d
    '1Y': '1y',
    'ALL': 'all',
  };

  const timeRange = timeRangeMap[timeframe] || '1m';

  const response = await apiClient.get<{ success: boolean; data: { user: any; graphData: any } }>(`/wallet/${walletAddress}`, {
    timeRange,
    limit: 100,
  });

  if (!response.success) {
    throw new Error('Failed to fetch chart data');
  }

  // Transform balance history to chart data
  const { graphData } = response.data;
  const chartData = graphData?.data?.map((entry: any) => ({
    date: new Date(entry.timestamp).toLocaleDateString(),
    value: parseFloat(entry.balance) / Math.pow(10, entry.decimals),
  })) || [];

  return chartData;
}
