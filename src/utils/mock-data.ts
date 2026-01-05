/**
 * Mock Data Module
 * Temporary placeholder data for pages not yet integrated with real API
 * Replace with actual API calls when endpoints are available
 */

export const api = {
  // These are placeholder mock functions - replace with real API endpoints
  
  async getHistory(_days?: number) {
    return [];
  },

  async getHotBowls() {
    return [];
  },

  async getLiquidityPools() {
    return [];
  },

  async getLendingOptions() {
    return [];
  },

  async getStakingStrategies() {
    return [];
  },

  async getNotifications() {
    return [];
  },

  async getDefiPositions() {
    return [];
  },

  async getPoolDetail(_poolId: string) {
    return {};
  },

  async getPoolTransactions(_poolId: string) {
    return [];
  },

  async getPoolChartData(_poolId: string) {
    return [];
  },
};
