import { Transfer } from '@/types';
import { apiClient } from './client';

export async function getTransfers(): Promise<Transfer[]> {
  return apiClient.get<Transfer[]>('/transfers');
}
