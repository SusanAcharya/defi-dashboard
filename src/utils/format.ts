export const formatCurrency = (value: number | undefined, currency: string = 'USD', showNumbers: boolean = true): string => {
  if (!showNumbers) {
    // Return masked value like banks do (e.g., "••••")
    return '••••';
  }
  if (value === undefined || value === null || isNaN(value)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

// Format Starknet address (66 chars: 0x + 64 hex chars)
// Default shows first 8 and last 6 chars for better readability
export const formatAddress = (address: string, start: number = 8, end: number = 6): string => {
  if (!address) return '';
  // Remove 0x prefix for formatting if present
  const cleanAddress = address.startsWith('0x') ? address.slice(2) : address;
  if (cleanAddress.length <= start + end) return address;
  return `0x${cleanAddress.slice(0, start)}...${cleanAddress.slice(-end)}`;
};

export const formatNumber = (value: number | string, decimals: number = 2, showNumbers: boolean = true): string => {
  if (!showNumbers) {
    return '••••';
  }
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercentage = (value: number | undefined, decimals: number = 2, showNumbers: boolean = true): string => {
  if (!showNumbers) {
    return '•••';
  }
  if (value === undefined || value === null || isNaN(value)) {
    return '0%';
  }
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}/${day}/${year} at ${hours}:${minutes}`;
};


// Cached divisors for performance optimization
const divisorCache = new Map<number, bigint>();
const getDivisor = (decimals: number): bigint => {
  if (!divisorCache.has(decimals)) {
    divisorCache.set(decimals, BigInt(10 ** decimals));
  }
  return divisorCache.get(decimals)!;
};

/**
 * Convert token balance to human-readable amount
 * @param balance Balance as string (in smallest unit, wei)
 * @param decimals Number of decimal places
 * @returns Human-readable token amount
 */
export const convertBalanceToTokenAmount = (balance: string | number, decimals: number): number => {
  try {
    const balanceBigInt = BigInt(balance);
    const divisor = getDivisor(decimals);
    const tokenAmount = Number(balanceBigInt) / Number(divisor);
    return Math.round(tokenAmount * 100) / 100;
  } catch (error) {
    console.warn(`Failed to convert balance: ${balance} with ${decimals} decimals`);
    return 0;
  }
};


/**
 * Calculate the total value of tokens in USD
 * @param tokens Array of token objects with balance and decimals
 * @returns Total value in USD
 */
export const calculateTokenPortfolioValue = (tokens: any[]): number => {
  if (!tokens?.length) return 0;

  return Math.round(
    tokens.reduce((totalValue, token) => {
      try {
        return totalValue + convertBalanceToTokenAmount(token.balance, token.decimals);
      } catch (error) {
        console.warn(`Error calculating value for token ${token.symbol}:`, error);
        return totalValue;
      }
    }, 0) * 100
  ) / 100;
};

