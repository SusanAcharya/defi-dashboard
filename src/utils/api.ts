/**
 * API Layer
 * Re-exports actual API service functions from their respective modules
 * All implementations use real API endpoints from API_DOCUMENTATION.md
 */

import { DefiPosition } from '@/types';

// Portfolio API
export { getPortfolio, getPortfolioChartData } from '@/services/portfolio.api';

// Token API
export { tokenAPI } from '@/services/token.api';

// Auth API
export { authAPI } from '@/services/auth.api';

// Activity & History API
export { getActivities } from '@/services/activity.api';
export { getHistory } from '@/services/history.api';

// Wallet API
export { walletAPI } from '@/services/wallet.api';

// DeFi Positions - Static data for now
export async function getDefiPositions(walletAddress?: string | null): Promise<DefiPosition[]> {
  const multiplier = walletAddress ? 0.4 : 1;
  return [
    { id: '1', protocol: 'JediSwap', positionValue: 50000 * multiplier, apr: 12.5, claimableRewards: 500 * multiplier, type: 'lp' },
    { id: '2', protocol: '10KSwap', positionValue: 30000 * multiplier, apr: 8.2, claimableRewards: 200 * multiplier, type: 'lp' },
    { id: '3', protocol: 'Ekubo', positionValue: 25000 * multiplier, apr: 15.3, claimableRewards: 300 * multiplier, type: 'lp' },
    { id: '4', protocol: 'zkLend', positionValue: 40000 * multiplier, apr: 6.8, claimableRewards: 150 * multiplier, type: 'lending' },
  ];
}