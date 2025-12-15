export interface Wallet {
  address: string;
  shortAddress: string;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  usdValue: number;
  price: number;
  change24h: number;
  logo?: string;
  address?: string;
  liquidity?: number;
}

export interface Portfolio {
  totalValue: number;
  totalAssets: number;
  totalDebt: number;
  nftValue: number;
  pnl24h: number;
  pnl24hPercent: number;
}

export interface Activity {
  id: string;
  type: 'swap' | 'transfer' | 'contract' | 'airdrop';
  title: string;
  description: string;
  timestamp: number;
  amount?: number;
  token?: string;
}

export interface Notification extends Activity {
  read: boolean;
  category: string;
}

export interface DefiPosition {
  id: string;
  protocol: string;
  logo?: string;
  positionValue: number;
  apr: number;
  claimableRewards: number;
  type: 'staking' | 'lp' | 'lending';
}

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  priceImpact: number;
  slippage: number;
  networkFee: number;
}

export interface AddressBookEntry {
  id: string;
  name: string;
  address: string;
  notes?: string;
}

export interface Transfer {
  id: string;
  type: 'incoming' | 'outgoing';
  token: string;
  amount: string;
  from: string;
  to: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  txHash: string;
}

export interface Airdrop {
  id: string;
  name: string;
  description: string;
  eligible: boolean;
  unclaimedValue: number;
  claimable: boolean;
  launchDate?: number;
}

export interface StakingPool {
  id: string;
  name: string;
  token: string;
  apr: number;
  totalStaked: number;
  userStaked: number;
  logo?: string;
}

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  emeralds: number;
  username?: string;
  alias?: string;
}

export interface NFT {
  id: string;
  collection: string;
  name: string;
  image?: string;
  floorPrice: number;
  mintPrice?: number;
  supply?: number;
  launchDate?: number;
}

export interface Settings {
  telegramAlerts: boolean;
  pushNotifications: boolean;
  currency: 'USD' | 'EUR' | 'BTC';
  theme: 'light' | 'dark';
  language: string;
}

export interface LiquidityPool {
  id: string;
  pair: string;
  protocol: string;
  poolType: string;
  fee: string;
  tvl: number;
  volume24h: number;
  volume7d: number;
  fee24h: number;
  fee7d: number;
  apr24h: number;
  apr7d: number;
  rewards?: string;
  verified?: boolean;
  hasRewards?: boolean;
}

export interface HotBowl {
  id: string;
  pair: string;
  apr: number;
  category: 'high-apr' | 'stablecoin' | 'blue-chip' | 'memecoin';
}

export interface LendingOption {
  id: string;
  protocol: string;
  token: string;
  supplyApr: number;
  borrowApr: number;
  totalSupply: number;
  totalBorrow: number;
  logo?: string;
}

export interface StakingStrategy {
  id: string;
  name: string;
  provider: string;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  tvl: number;
  logo?: string;
  verified?: boolean;
  bonus?: string;
}

export interface PoolDetail extends LiquidityPool {
  poolAddress: string;
  currentPrice: string;
  lpBreakdown: {
    asset: string;
    coinAmount: number;
    value: number;
    percentage: number;
  }[];
  tvlChange24h: number;
  volumeChange24h: number;
  feeChange24h: number;
  aprChange24h: number;
}

export interface PoolTransaction {
  id: string;
  type: 'buy' | 'sell' | 'add-liquidity' | 'remove-liquidity';
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  amountOut: number;
  usdValue: number;
  timestamp: number;
  address: string;
}

export interface PoolChartData {
  date: string;
  tvl?: number;
  volume?: number;
  fee?: number;
  apr?: number;
}

