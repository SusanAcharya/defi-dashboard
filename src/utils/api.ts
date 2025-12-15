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
  LiquidityPool,
  HotBowl,
  LendingOption,
  StakingStrategy,
  PoolDetail,
  PoolTransaction,
  PoolChartData,
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

  // Explore - Hot Bowls
  async getHotBowls(category?: string): Promise<HotBowl[]> {
    await delay(500);
    const allBowls: HotBowl[] = [
      // High APR
      { id: '1', pair: 'STRK/USDC', apr: 2989.47, category: 'high-apr' },
      { id: '2', pair: 'ETH/USDC', apr: 1637.73, category: 'high-apr' },
      { id: '3', pair: 'ZKX/STRK', apr: 1114.55, category: 'high-apr' },
      { id: '4', pair: 'DEEP/USDC', apr: 933.82, category: 'high-apr' },
      { id: '5', pair: 'MYSTR/STRK', apr: 849.89, category: 'high-apr' },
      // Stablecoin
      { id: '6', pair: 'USDC/USDT', apr: 12.79, category: 'stablecoin' },
      { id: '7', pair: 'USDT/USDC', apr: 11.31, category: 'stablecoin' },
      { id: '8', pair: 'USDC/USDT', apr: 9.86, category: 'stablecoin' },
      { id: '9', pair: 'USDT/USDC', apr: 4.399, category: 'stablecoin' },
      { id: '10', pair: 'USDC/USDT', apr: 4.61, category: 'stablecoin' },
      // Blue-chips
      { id: '11', pair: 'ETH/USDC', apr: 9.47, category: 'blue-chip' },
      { id: '12', pair: 'ETH/STRK', apr: 2.53, category: 'blue-chip' },
      { id: '13', pair: 'STRK/ETH', apr: 6.99, category: 'blue-chip' },
      { id: '14', pair: 'ETH/USDC', apr: 1.37, category: 'blue-chip' },
      { id: '15', pair: 'ETH/STRK', apr: 9.46, category: 'blue-chip' },
      // Memecoins
      { id: '16', pair: 'REKT/STRK', apr: 56.27, category: 'memecoin' },
      { id: '17', pair: 'ZKX/STRK', apr: 45.33, category: 'memecoin' },
      { id: '18', pair: 'DEEP/STRK', apr: 634.37, category: 'memecoin' },
      { id: '19', pair: 'REKT/ZKX', apr: 247.68, category: 'memecoin' },
      { id: '20', pair: 'STRK/DEEP', apr: 9.66, category: 'memecoin' },
    ];
    return category ? allBowls.filter(bowl => bowl.category === category) : allBowls;
  },

  // Explore - Liquidity Pools
  async getLiquidityPools(): Promise<LiquidityPool[]> {
    await delay(500);
    return [
      { id: '1', pair: 'USDC/USDT', protocol: 'JediSwap', poolType: 'CLMM', fee: '0.001%', tvl: 5960800, volume24h: 59079000, volume7d: 413553000, fee24h: 590.89, fee7d: 4135.53, apr24h: 12.79, apr7d: 12.79, verified: true, hasRewards: true, rewards: 'STRK' },
      { id: '2', pair: 'USDT/USDC', protocol: '10KSwap', poolType: 'CLMM', fee: '0.001%', tvl: 13806500, volume24h: 40839700, volume7d: 285877900, fee24h: 408.42, fee7d: 2858.78, apr24h: 11.31, apr7d: 11.31, verified: true, hasRewards: true, rewards: 'STRK' },
      { id: '3', pair: 'USDC/USDT', protocol: 'Ekubo', poolType: 'CLMM', fee: '0.001%', tvl: 6846500, volume24h: 12012200, volume7d: 84085400, fee24h: 120.13, fee7d: 840.85, apr24h: 9.86, apr7d: 9.86, verified: true, hasRewards: true, rewards: 'STRK' },
      { id: '4', pair: 'USDT/USDC', protocol: 'JediSwap', poolType: 'CLMM', fee: '0.001%', tvl: 6097400, volume24h: 10065700, volume7d: 70459900, fee24h: 100.66, fee7d: 704.60, apr24h: 4.399, apr7d: 4.399, verified: true, hasRewards: true, rewards: 'STRK' },
      { id: '5', pair: 'STRK/USDC', protocol: 'Ekubo', poolType: 'CLMM', fee: '0.01%', tvl: 1093000, volume24h: 9746100, volume7d: 68222700, fee24h: 974.62, fee7d: 6822.27, apr24h: 32.54, apr7d: 32.54, verified: true, hasRewards: false },
      { id: '6', pair: 'USDC/USDT', protocol: '10KSwap', poolType: 'DLMM', fee: '0.001%', tvl: 9099200, volume24h: 7897800, volume7d: 55284600, fee24h: 79, fee7d: 552.85, apr24h: 4.61, apr7d: 4.61, verified: true, hasRewards: true, rewards: 'STRK' },
      { id: '7', pair: 'ETH/USDC', protocol: 'JediSwap', poolType: 'CLMM', fee: '0.3%', tvl: 2500000, volume24h: 5000000, volume7d: 35000000, fee24h: 15000, fee7d: 105000, apr24h: 15.5, apr7d: 15.5, verified: true, hasRewards: true, rewards: 'STRK' },
      { id: '8', pair: 'STRK/ETH', protocol: 'Ekubo', poolType: 'CLMM', fee: '0.3%', tvl: 1800000, volume24h: 3500000, volume7d: 24500000, fee24h: 10500, fee7d: 73500, apr24h: 12.3, apr7d: 12.3, verified: true, hasRewards: true, rewards: 'STRK' },
    ];
  },

  // Explore - Lending Options
  async getLendingOptions(): Promise<LendingOption[]> {
    await delay(500);
    return [
      { id: '1', protocol: 'zkLend', token: 'USDC', supplyApr: 8.5, borrowApr: 12.3, totalSupply: 5000000, totalBorrow: 2000000 },
      { id: '2', protocol: 'Nostra Finance', token: 'ETH', supplyApr: 5.2, borrowApr: 8.7, totalSupply: 3000000, totalBorrow: 1500000 },
      { id: '3', protocol: 'zkLend', token: 'STRK', supplyApr: 12.0, borrowApr: 18.5, totalSupply: 2000000, totalBorrow: 800000 },
      { id: '4', protocol: 'Nostra Finance', token: 'USDT', supplyApr: 7.8, borrowApr: 11.2, totalSupply: 4000000, totalBorrow: 1800000 },
      { id: '5', protocol: 'zkLend', token: 'ETH', supplyApr: 4.8, borrowApr: 7.9, totalSupply: 2500000, totalBorrow: 1200000 },
    ];
  },

  // Explore - Staking Strategies
  async getStakingStrategies(): Promise<StakingStrategy[]> {
    await delay(500);
    return [
      { id: '1', name: 'Ekubo ETH/USDC.e', provider: 'Re7 Labs', apy: 197.27, risk: 'high', tvl: 107735, verified: true },
      { id: '2', name: 'Ekubo STRK/USDC.e', provider: 'Re7 Labs', apy: 130.16, risk: 'high', tvl: 42295, verified: true },
      { id: '3', name: 'Ekubo ETH/USDC.e', provider: 'Re7 Labs', apy: 83.60, risk: 'high', tvl: 88855, verified: true },
      { id: '4', name: 'Ekubo STRK/ETH', provider: 'Re7 Labs', apy: 65.59, risk: 'high', tvl: 41216, verified: true },
      { id: '5', name: 'zkLend USDT', provider: 'Troves', apy: 32.51, risk: 'low', tvl: 7, verified: true },
      { id: '6', name: 'STRK Native Staking', provider: 'Starknet', apy: 20.60, risk: 'low', tvl: 159091, verified: true, bonus: '4x Points' },
    ];
  },

  // Pool Detail
  async getPoolDetail(poolId: string): Promise<PoolDetail> {
    await delay(500);
    const pool = (await this.getLiquidityPools()).find(p => p.id === poolId);
    if (!pool) throw new Error('Pool not found');
    
    return {
      ...pool,
      poolAddress: '0xe31d582e1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      currentPrice: pool.pair.includes('USDC') && pool.pair.includes('USDT') 
        ? '1 USDC = 0.9997 USDT' 
        : '1 STRK = 1.2 USDC',
      lpBreakdown: [
        { asset: 'USDC', coinAmount: 3759700, value: 3760200, percentage: 63.04 },
        { asset: 'USDT', coinAmount: 2203700, value: 2204600, percentage: 36.96 },
      ],
      tvlChange24h: -1.4,
      volumeChange24h: -11.35,
      feeChange24h: -11.34,
      aprChange24h: 0.5,
    };
  },

  async getPoolTransactions(_poolId: string, type?: string): Promise<PoolTransaction[]> {
    await delay(500);
    const transactions: PoolTransaction[] = [
      { id: '1', type: 'sell', tokenIn: 'USDC', tokenOut: 'USDT', amountIn: 0.0014, amountOut: 0.0014, usdValue: 0.001, timestamp: Date.now() - 60000, address: '0x662f1234567890abcdef1234567890abcdef1234567890abcdef1234567890aae3' },
      { id: '2', type: 'sell', tokenIn: 'USDC', tokenOut: 'USDT', amountIn: 0.0013, amountOut: 0.0013, usdValue: 0.001, timestamp: Date.now() - 60000, address: '0xb0c21234567890abcdef1234567890abcdef1234567890abcdef1234567890c13a' },
      { id: '3', type: 'buy', tokenIn: 'USDT', tokenOut: 'USDC', amountIn: 0.06, amountOut: 0.06, usdValue: 0.06, timestamp: Date.now() - 60000, address: '0xea941234567890abcdef1234567890abcdef1234567890abcdef12345678905c04' },
      { id: '4', type: 'add-liquidity', tokenIn: 'USDC', tokenOut: 'USDT', amountIn: 1000, amountOut: 1000, usdValue: 2000, timestamp: Date.now() - 120000, address: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' },
      { id: '5', type: 'remove-liquidity', tokenIn: 'USDC', tokenOut: 'USDT', amountIn: 500, amountOut: 500, usdValue: 1000, timestamp: Date.now() - 180000, address: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' },
    ];
    return type ? transactions.filter(t => t.type === type as any) : transactions;
  },

  async getPoolChartData(_poolId: string, metric: 'tvl' | 'volume' | 'fee' | 'apr', timeframe: '1w' | '1m' | '1y'): Promise<PoolChartData[]> {
    await delay(500);
    const days = timeframe === '1w' ? 7 : timeframe === '1m' ? 30 : 365;
    const data: PoolChartData[] = [];
    const baseValue = metric === 'tvl' ? 6000000 : metric === 'volume' ? 50000000 : metric === 'fee' ? 500 : 12;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const value = baseValue * (1 + (Math.random() - 0.5) * 0.3);
      data.push({
        date: date.toISOString().split('T')[0],
        [metric]: value,
      });
    }
    return data;
  },
};

