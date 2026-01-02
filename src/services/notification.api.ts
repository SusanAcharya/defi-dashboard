import { Notification } from '@/types';
import { apiClient } from './client';

export async function getNotifications(walletAddress?: string | null): Promise<Notification[]> {
  const endpoint = walletAddress ? `/notifications/${walletAddress}` : '/notifications';
  return apiClient.get<Notification[]>(endpoint);
}
