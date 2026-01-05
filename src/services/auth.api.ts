/**
 * Authentication API Service
 * Handles wallet onboarding and subscription management
 */

import { apiClient } from './client';

export interface OnboardRequest {
  walletAddress: string;
  telegramId?: string;
}

export interface SubscriptionRequest {
  walletAddress: string;
  subscribedAddress: string;
}

export interface AddSubscriptionRequest extends SubscriptionRequest {
  name: string;
}

export interface Subscription {
  name: string;
  walletAddress: string;
}

export interface SubscriptionsResponse {
  success: boolean;
  data: {
    subscriptions: Subscription[];
  };
}

export const authAPI = {
  /**
   * Onboard a new wallet address
   */
  onboard: async (walletAddress: string, telegramId?: string) => {
    const response = await apiClient.post('/auth/onboard', {
      walletAddress,
      ...(telegramId && { telegramId }),
    });
    return response;
  },

  /**
   * Add a subscription to track another wallet
   */
  addSubscription: async (walletAddress: string, subscribedAddress: string, name: string) => {
    const response = await apiClient.post('/auth/subscribed/add', {
      walletAddress,
      subscribedAddress,
      name,
    });
    return response;
  },

  /**
   * Remove a subscription
   */
  removeSubscription: async (walletAddress: string, subscribedAddress: string) => {
    const response = await apiClient.post('/auth/subscribed/remove', {
      walletAddress,
      subscribedAddress,
    });
    return response;
  },

  /**
   * Get all subscriptions for a wallet
   */
  getSubscriptions: async (walletAddress: string): Promise<SubscriptionsResponse> => {
    const response = await apiClient.get<SubscriptionsResponse>('/auth/subscribed', {
      walletAddress,
    });
    return response;
  },
};
