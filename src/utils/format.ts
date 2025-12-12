export const formatCurrency = (value: number, currency: string = 'USD', showNumbers: boolean = true): string => {
  if (!showNumbers) {
    // Return masked value like banks do (e.g., "••••")
    return '••••';
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

export const formatPercentage = (value: number, decimals: number = 2, showNumbers: boolean = true): string => {
  if (!showNumbers) {
    return '•••';
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

