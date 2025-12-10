// API service layer - Mock implementations
// Replace with actual API calls when backend is ready

import { 
  Token, 
  Portfolio, 
  Activity, 
  Notification, 
  DefiPosition, 
  SwapQuote,
  AddressBookEntry,
  Transfer,
  Airdrop,
  StakingPool,
  LeaderboardEntry,
  NFT,
} from '@/types';

// Mock delay for simulating API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Portfolio
  async getPortfolio(): Promise<Portfolio> {
    await delay(500);
    return {
      totalValue: 999999999,
      totalAssets: 999999999,
      totalDebt: 0,
      nftValue: 999999999,
      pnl24h: 888888,
      pnl24hPercent: 0.89,
    };
  },

  async getTokens(): Promise<Token[]> {
    await delay(500);
    return [
      { id: '1', symbol: 'ETH', name: 'Ethereum', balance: '10.5', usdValue: 21000, price: 2000, change24h: 2.5 },
      { id: '2', symbol: 'USDC', name: 'USD Coin', balance: '50000', usdValue: 50000, price: 1, change24h: 0.1 },
      { id: '3', symbol: 'STRK', name: 'Starknet', balance: '1000', usdValue: 500, price: 0.5, change24h: -1.2 },
    ];
  },

  // Activities
  async getActivities(): Promise<Activity[]> {
    await delay(500);
    return [
      { id: '1', type: 'swap', title: 'Swap detected', description: 'Swapped 1 ETH for 2000 USDC', timestamp: Date.now() - 3600000, amount: 1, token: 'ETH' },
      { id: '2', type: 'transfer', title: 'Incoming token', description: 'Received 100 STRK', timestamp: Date.now() - 7200000, amount: 100, token: 'STRK' },
      { id: '3', type: 'contract', title: 'Contract interaction', description: 'Interacted with DeFi protocol', timestamp: Date.now() - 10800000 },
      { id: '4', type: 'airdrop', title: 'Airdrop alert', description: 'New airdrop available', timestamp: Date.now() - 14400000 },
    ];
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    await delay(500);
    return [
      { id: '1', type: 'swap', category: 'Swap', title: 'Swap completed', description: 'Swapped 1 ETH for 2000 USDC', timestamp: Date.now() - 3600000, read: false },
      { id: '2', type: 'transfer', category: 'Transfer', title: 'Token received', description: 'Received 100 STRK', timestamp: Date.now() - 7200000, read: false },
      { id: '3', type: 'airdrop', category: 'Airdrop', title: 'Airdrop available', description: 'Claim your airdrop now', timestamp: Date.now() - 10800000, read: true },
    ];
  },

  // DeFi
  async getDefiPositions(): Promise<DefiPosition[]> {
    await delay(500);
    return [
      { id: '1', protocol: 'StarkSwap', positionValue: 50000, apr: 12.5, claimableRewards: 500, type: 'staking' },
      { id: '2', protocol: 'JediSwap', positionValue: 30000, apr: 8.2, claimableRewards: 200, type: 'lp' },
    ];
  },

  // Swap
  async getSwapQuote(_fromToken: string, _toToken: string, amount: string): Promise<SwapQuote> {
    await delay(500);
    return {
      fromToken: { id: '1', symbol: 'ETH', name: 'Ethereum', balance: '10', usdValue: 20000, price: 2000, change24h: 0 },
      toToken: { id: '2', symbol: 'USDC', name: 'USD Coin', balance: '0', usdValue: 0, price: 1, change24h: 0 },
      fromAmount: amount,
      toAmount: (parseFloat(amount) * 2000).toString(),
      priceImpact: 0.5,
      slippage: 0.5,
      networkFee: 0.001,
    };
  },

  // Address Book
  async getAddressBook(): Promise<AddressBookEntry[]> {
    await delay(300);
    return [
      { id: '1', name: 'Alice', address: '0x1234...5678', notes: 'Friend' },
      { id: '2', name: 'Bob', address: '0xabcd...efgh', notes: 'Business' },
    ];
  },

  // Transfers
  async getTransfers(): Promise<Transfer[]> {
    await delay(500);
    return [
      { id: '1', type: 'incoming', token: 'ETH', amount: '1.5', from: '0x1234...5678', to: '0xabcd...efgh', status: 'completed', timestamp: Date.now() - 86400000, txHash: '0x...' },
      { id: '2', type: 'outgoing', token: 'USDC', amount: '1000', from: '0xabcd...efgh', to: '0x1234...5678', status: 'completed', timestamp: Date.now() - 172800000, txHash: '0x...' },
    ];
  },

  // Airdrops
  async getAirdrops(): Promise<Airdrop[]> {
    await delay(500);
    return [
      { id: '1', name: 'Starknet Airdrop', description: 'Eligible for 1000 tokens', eligible: true, unclaimedValue: 500, claimable: true },
      { id: '2', name: 'Upcoming Airdrop', description: 'Launching soon', eligible: false, unclaimedValue: 0, claimable: false, launchDate: Date.now() + 86400000 },
    ];
  },

  // Staking
  async getStakingPools(): Promise<StakingPool[]> {
    await delay(500);
    return [
      { id: '1', name: 'ETH Staking Pool', token: 'ETH', apr: 15.5, totalStaked: 1000000, userStaked: 10 },
      { id: '2', name: 'STRK Staking Pool', token: 'STRK', apr: 12.0, totalStaked: 500000, userStaked: 0 },
    ];
  },

  // Leaderboard
  async getLeaderboard(_tab: string = 'global'): Promise<LeaderboardEntry[]> {
    await delay(500);
    return [
      { rank: 1, wallet: '0x1111...1111', emeralds: 10000, username: 'n00dlehead', alias: 'Thug' },
      { rank: 2, wallet: '0x2222...2222', emeralds: 9500 },
      { rank: 3, wallet: '0x3333...3333', emeralds: 9000 },
    ];
  },

  // NFTs
  async getNFTs(): Promise<NFT[]> {
    await delay(500);
    return [
      { id: '1', collection: 'StarkPunks', name: 'StarkPunk #1234', floorPrice: 0.5, mintPrice: 0.1, supply: 10000, launchDate: Date.now() + 86400000 },
      { id: '2', collection: 'StarkApes', name: 'StarkApe #5678', floorPrice: 1.2, mintPrice: 0.5, supply: 5000 },
    ];
  },
};

