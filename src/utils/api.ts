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
      totalValue: 125000000, // Starknet portfolio value
      totalAssets: 125000000,
      totalDebt: 0,
      nftValue: 5000000, // Starknet NFTs
      pnl24h: 888888,
      pnl24hPercent: 0.89,
    };
  },

  async getTokens(): Promise<Token[]> {
    await delay(500);
    return [
      // Starknet native token
      { id: '1', symbol: 'STRK', name: 'Starknet', balance: '1000', usdValue: 1200000000, price: 1.2, change24h: 2.5, address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', liquidity: 50000000 },
      // Bridged tokens on Starknet
      { id: '2', symbol: 'ETH', name: 'Ethereum', balance: '10.5', usdValue: 21000000, price: 2000, change24h: 1.8, address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', liquidity: 15000000 },
      { id: '3', symbol: 'USDC', name: 'USD Coin', balance: '50000', usdValue: 50000000, price: 1, change24h: 0.037, address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', liquidity: 8000000 },
      { id: '4', symbol: 'USDT', name: 'Tether USD', balance: '0', usdValue: 30000000, price: 1, change24h: 0.01, address: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', liquidity: 5000000 },
      // Starknet ecosystem tokens
      { id: '5', symbol: 'DEEP', name: 'DeepBook Token', balance: '0', usdValue: 99290000, price: 0.04, change24h: -4.35, address: '0x03d90e2b8e9b6e7e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0', liquidity: 972000 },
      { id: '6', symbol: 'ZKX', name: 'ZKX Protocol', balance: '0', usdValue: 50000000, price: 0.15, change24h: 3.2, address: '0x04a0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0', liquidity: 500000 },
      { id: '7', symbol: 'MYSTR', name: 'Mystra', balance: '0', usdValue: 25000000, price: 0.08, change24h: -2.1, address: '0x05b0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0', liquidity: 300000 },
      { id: '8', symbol: 'REKT', name: 'Rekt Protocol', balance: '0', usdValue: 15000000, price: 0.12, change24h: 5.5, address: '0x06c0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0', liquidity: 200000 },
    ];
  },

  // Activities - Starknet transactions
  async getActivities(): Promise<Activity[]> {
    await delay(500);
    return [
      { id: '1', type: 'swap', title: 'Swap on JediSwap', description: 'Swapped 1 ETH for 2000 USDC', timestamp: Date.now() - 3600000, amount: 1, token: 'ETH' },
      { id: '2', type: 'transfer', title: 'STRK received', description: 'Received 100 STRK from wallet', timestamp: Date.now() - 7200000, amount: 100, token: 'STRK' },
      { id: '3', type: 'contract', title: 'zkLend interaction', description: 'Deposited 5000 USDC to zkLend', timestamp: Date.now() - 10800000 },
      { id: '4', type: 'airdrop', title: 'Starknet airdrop', description: 'New Starknet ecosystem airdrop available', timestamp: Date.now() - 14400000 },
    ];
  },

  // Notifications - Starknet ecosystem
  async getNotifications(): Promise<Notification[]> {
    await delay(500);
    return [
      { id: '1', type: 'swap', category: 'Swap', title: 'JediSwap completed', description: 'Swapped 1 ETH for 2000 USDC on Starknet', timestamp: Date.now() - 3600000, read: false },
      { id: '2', type: 'transfer', category: 'Transfer', title: 'STRK received', description: 'Received 100 STRK on Starknet', timestamp: Date.now() - 7200000, read: false },
      { id: '3', type: 'airdrop', category: 'Airdrop', title: 'Starknet airdrop', description: 'New Starknet ecosystem airdrop available', timestamp: Date.now() - 10800000, read: true },
    ];
  },

  // DeFi - Starknet protocols
  async getDefiPositions(): Promise<DefiPosition[]> {
    await delay(500);
    return [
      { id: '1', protocol: 'JediSwap', positionValue: 50000, apr: 12.5, claimableRewards: 500, type: 'lp' },
      { id: '2', protocol: '10KSwap', positionValue: 30000, apr: 8.2, claimableRewards: 200, type: 'lp' },
      { id: '3', protocol: 'Ekubo', positionValue: 25000, apr: 15.3, claimableRewards: 300, type: 'lp' },
      { id: '4', protocol: 'zkLend', positionValue: 40000, apr: 6.8, claimableRewards: 150, type: 'lending' },
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
      { id: '1', name: 'Alice', address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', notes: 'Friend' },
      { id: '2', name: 'Bob', address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', notes: 'Business' },
    ];
  },

  // Transfers - Starknet transactions
  async getTransfers(): Promise<Transfer[]> {
    await delay(500);
    return [
      { id: '1', type: 'incoming', token: 'STRK', amount: '1000', from: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', to: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', status: 'completed', timestamp: Date.now() - 86400000, txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' },
      { id: '2', type: 'outgoing', token: 'USDC', amount: '1000', from: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', to: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', status: 'completed', timestamp: Date.now() - 172800000, txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' },
    ];
  },

  // Airdrops - Starknet ecosystem
  async getAirdrops(): Promise<Airdrop[]> {
    await delay(500);
    return [
      { id: '1', name: 'Starknet Ecosystem Airdrop', description: 'Eligible for 1000 STRK tokens', eligible: true, unclaimedValue: 1200, claimable: true },
      { id: '2', name: 'JediSwap Airdrop', description: 'Rewards for early LP providers', eligible: true, unclaimedValue: 500, claimable: true },
      { id: '3', name: 'zkLend Airdrop', description: 'Launching soon for lenders', eligible: false, unclaimedValue: 0, claimable: false, launchDate: Date.now() + 86400000 },
      { id: '4', name: '10KSwap Airdrop', description: 'Coming soon for active traders', eligible: false, unclaimedValue: 0, claimable: false, launchDate: Date.now() + 172800000 },
    ];
  },

  // Staking - Starknet pools
  async getStakingPools(): Promise<StakingPool[]> {
    await delay(500);
    return [
      { id: '1', name: 'STRK Native Staking', token: 'STRK', apr: 12.0, totalStaked: 5000000, userStaked: 1000 },
      { id: '2', name: 'ETH Staking on Starknet', token: 'ETH', apr: 15.5, totalStaked: 1000000, userStaked: 10 },
      { id: '3', name: 'USDC Lending Pool', token: 'USDC', apr: 8.2, totalStaked: 2000000, userStaked: 50000 },
    ];
  },

  // Leaderboard - Starknet wallets
  async getLeaderboard(_tab: string = 'global'): Promise<LeaderboardEntry[]> {
    await delay(500);
    return [
      { rank: 1, wallet: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', emeralds: 10000, username: 'n00dlehead', alias: 'Thug' },
      { rank: 2, wallet: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', emeralds: 9500 },
      { rank: 3, wallet: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', emeralds: 9000 },
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

