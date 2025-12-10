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

