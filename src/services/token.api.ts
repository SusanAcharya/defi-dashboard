/**
 * Token API Service
 * Handles token data retrieval
 */

import { Token } from '@/types';
import { apiClient } from './client';

export interface TokenData {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  isNative: boolean;
  isVerified: boolean;
}

export interface AllTokensResponse {
  success: boolean;
  data: {
    tokens: TokenData[];
    count: number;
  };
}

export interface SingleTokenResponse {
  success: boolean;
  data: TokenData;
}

/**
 * Get tokens for a wallet (existing function)
 */
export async function getTokens(walletAddress?: string | null): Promise<Token[]> {
  const endpoint = walletAddress ? `/tokens/${walletAddress}` : '/tokens';
  return apiClient.get<Token[]>(endpoint);
}

export const tokenAPI = {
  /**
   * Get all supported tokens
   */
  getAllTokens: async (): Promise<AllTokensResponse> => {
    const response = await apiClient.get<AllTokensResponse>('/tokens');
    return response;
  },

  /**
   * Get token information by contract address
   */
  getTokenByAddress: async (address: string): Promise<SingleTokenResponse> => {
    const response = await apiClient.get<SingleTokenResponse>(`/tokens/${address}`);
    return response;
  },

  /**
   * Get token information by symbol
   */
  getTokenBySymbol: async (symbol: string): Promise<SingleTokenResponse> => {
    const response = await apiClient.get<SingleTokenResponse>(`/tokens/symbol/${symbol}`);
    return response;
  },

  /**
   * Get multiple tokens by addresses
   */
  getTokensByAddresses: async (addresses: string[]): Promise<TokenData[]> => {
    const tokens: TokenData[] = [];

    for (const address of addresses) {
      try {
        const response = await tokenAPI.getTokenByAddress(address);
        tokens.push(response.data);
      } catch (error) {
      }
    }

    return tokens;
  },
};
