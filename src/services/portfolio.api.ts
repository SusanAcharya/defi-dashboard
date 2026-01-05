import { Portfolio } from '@/types';
import { apiClient } from './client';
import { calculateTokenPortfolioValue } from '@/utils/format';

/**
 * Get portfolio data for a wallet
 * @param walletAddress - The wallet address
 * @returns Portfolio object with calculated values
 */
export async function getPortfolio(walletAddress?: string | null): Promise<Portfolio> {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  try {
    const response = await apiClient.get<{ success: boolean; data: { user: any; graphData: any } }>(`/wallet/${walletAddress}`);
    
    if (!response.success) {
      throw new Error('Failed to fetch portfolio');
    }

    const totalValue = calculateTokenPortfolioValue(response.data.user?.tokens);

    return {
      totalValue,
      totalAssets: totalValue,
      totalDebt: 0, 
      nftValue: 0,
      protocolRewards: 0,
      pnl24h: 0,
      pnl24hPercent: 0,
    };
  } catch (error) {
    console.error(`Failed to fetch portfolio for ${walletAddress}:`, error);
    throw error;
  }
}

/**
 * Get aggregated portfolio for multiple wallets
 * @param walletAddresses - Array of wallet addresses
 * @returns Portfolio object with aggregated values
 */
export async function getPortfolioForAllWallets(walletAddresses: string[]): Promise<Portfolio> {
  if (!walletAddresses?.length) {
    throw new Error('At least one wallet address is required');
  }

  try {
    const portfolios = await Promise.all(
      walletAddresses.map((address) =>
        getPortfolio(address).catch((error) => {
          console.error(`Failed to fetch portfolio for ${address}:`, error);
          return null;
        })
      )
    );

    const totalValue = portfolios.reduce((sum, portfolio) => sum + (portfolio?.totalValue || 0), 0);

    return {
      totalValue,
      totalAssets: totalValue,
      totalDebt: 0,
      nftValue: 0,
      protocolRewards: 0,
      pnl24h: 0,
      pnl24hPercent: 0,
    };
  } catch (error) {
    console.error('Error fetching portfolios for multiple wallets:', error);
    throw error;
  }
}

export async function getPortfolioChartData(
  walletAddress?: string | null,
  timeframe: string = '1W'
): Promise<Array<{ date: string; value: number }>> {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  // Map timeframe names to API timeRange parameter
  const timeRangeMap: { [key: string]: string } = {
    '1D': '1d',
    '7D': '1w',
    '30D': '1m',
    '180D': '6m',
    '1Y': '1y',
    'ALL': 'all',
  };

  const timeRange = timeRangeMap[timeframe] || '1m';

  const response = await apiClient.get<{ success: boolean; data: { user: any; graphData: any } }>(`/wallet/${walletAddress}`, {
    timeRange,
    limit: 100,
  });

  console.log('Portfolio chart data response:', response);

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
