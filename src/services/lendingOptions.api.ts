import { LendingOption } from '@/types';
import { apiClient } from './client';

export async function getLendingOptions(): Promise<LendingOption[]> {
  return apiClient.get<LendingOption[]>('/lending-options');
}
