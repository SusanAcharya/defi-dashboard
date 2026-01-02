import { Activity } from '@/types';
import { apiClient } from './client';

export async function getActivities(): Promise<Activity[]> {
  return apiClient.get<Activity[]>('/activities');
}
