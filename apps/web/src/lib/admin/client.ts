import type { AdminAnalyticsQueryData } from '@uprise/types';
import { api } from '@/lib/api';

export async function getAdminAnalytics(token: string) {
  return api.get<AdminAnalyticsQueryData>('/admin/analytics/query', { token });
}
