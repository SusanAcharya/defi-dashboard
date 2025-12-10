import { create } from 'zustand';
import { Token } from '@/types';

interface SwapState {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  slippage: number;
  
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  swapTokens: () => void;
  reset: () => void;
}

export const useSwapStore = create<SwapState>((set) => ({
  fromToken: null,
  toToken: null,
  fromAmount: '',
  toAmount: '',
  slippage: 0.5,
  
  setFromToken: (token) => set({ fromToken: token }),
  setToToken: (token) => set({ toToken: token }),
  setFromAmount: (amount) => set({ fromAmount: amount }),
  setToAmount: (amount) => set({ toAmount: amount }),
  setSlippage: (slippage) => set({ slippage }),
  swapTokens: () => set((state) => ({
    fromToken: state.toToken,
    toToken: state.fromToken,
    fromAmount: state.toAmount,
    toAmount: state.fromAmount,
  })),
  reset: () => set({
    fromToken: null,
    toToken: null,
    fromAmount: '',
    toAmount: '',
    slippage: 0.5,
  }),
}));

