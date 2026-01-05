import { Portfolio } from '@/types';
import { apiClient } from './client';
import {
  calculateTokenPortfolioValue,
  convertBalanceToTokenAmount,
} from '@/utils/format';

export async function getPortfolio(walletAddress?: string | null): Promise<Portfolio> {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }
  const response = await apiClient.get<{ success: boolean; data: { user: any; graphData: any } }>(`/wallet/${walletAddress}`);
  
  if (!response.success) {
    throw new Error('Failed to fetch portfolio');
  }

  // Transform API response to match Portfolio interface
  const { user } = response.data;
  
  // Calculate token portfolio value from tokens using conversion functions
  const tokenValue = user?.tokens ? calculateTokenPortfolioValue(user.tokens) : 0;
  
  // Total value includes both graph balance and token balance
  const totalValue =  tokenValue;



  console.log('Calculated total portfolio value:', totalValue);
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

export async function getPortfolioForAllWallets(walletAddresses: string[]): Promise<Portfolio> {
  if (!walletAddresses || walletAddresses.length === 0) {
    throw new Error('At least one wallet address is required');
  }

  let totalValue = 0;

  try {
    // Fetch portfolio data for all wallets in parallel
    const portfolioPromises = walletAddresses.map((address) =>
      getPortfolio(address).catch((error) => {
        console.error(`Error fetching portfolio for ${address}:`, error);
        return null;
      })
    );

    const portfolios = await Promise.all(portfolioPromises);

    // Sum all values from successful fetches
    totalValue = portfolios.reduce((sum, portfolio) => {
      return sum + (portfolio?.totalValue || 0);
    }, 0);
  } catch (error) {
    console.error('Error fetching portfolios for all wallets:', error);
    throw error;
  }

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
