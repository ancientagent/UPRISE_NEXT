import type { ApiResponse, BroadcastRotation, BroadcastRotationMeta, BroadcastTier } from '@uprise/types';
import { api } from '@/lib/api';

export type BroadcastRotationResponse = Omit<ApiResponse<BroadcastRotation>, 'meta'> & {
  meta?: NonNullable<ApiResponse<BroadcastRotation>['meta']> & BroadcastRotationMeta;
};

export async function getActiveBroadcastRotation(
  tier: BroadcastTier,
  token: string,
): Promise<BroadcastRotationResponse> {
  const query = new URLSearchParams({ tier });
  return api.get<BroadcastRotation>(`/broadcast/rotation?${query.toString()}`, { token }) as Promise<BroadcastRotationResponse>;
}
