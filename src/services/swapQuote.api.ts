import { SwapQuote } from '@/types';
import { apiClient } from './client';

export async function getSwapQuote(fromToken: string, toToken: string, amount: string): Promise<SwapQuote> {
  return apiClient.get<SwapQuote>('/swap/quote', { fromToken, toToken, amount });
}
