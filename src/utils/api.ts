/**
 * API Layer
 * Re-exports actual API service functions from their respective modules
 * All implementations use real API endpoints from API_DOCUMENTATION.md
 */

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
