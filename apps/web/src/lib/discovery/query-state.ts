import type { HomeSceneSelection, TunedSceneContext } from '@/store/onboarding';
import type { TierScope } from '@/lib/discovery/client';

export function getDefaultLocationQueryForTier(
  tier: TierScope,
  homeScene: HomeSceneSelection | null,
  tunedScene: TunedSceneContext | null,
): string {
  if (tier === 'national') return '';
  if (tier === 'state') return homeScene?.state ?? tunedScene?.state ?? '';
  return homeScene?.city ?? tunedScene?.city ?? '';
}
