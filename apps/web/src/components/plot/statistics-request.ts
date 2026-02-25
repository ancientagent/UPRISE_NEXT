export type TierScope = 'city' | 'state' | 'national';

export interface StatisticsEndpointResolution {
  endpoint: string;
  source: 'anchored' | 'active';
}

export function resolveStatisticsEndpoint(
  selectedCommunityId: string | null,
  selectedTier: TierScope,
): StatisticsEndpointResolution {
  if (selectedCommunityId) {
    return {
      endpoint: `/communities/${selectedCommunityId}/statistics?tier=${selectedTier}`,
      source: 'anchored',
    };
  }

  return {
    endpoint: `/communities/active/statistics?tier=${selectedTier}`,
    source: 'active',
  };
}

export function resolveSceneMapAnchorId(
  selectedCommunityId: string | null,
  activeSceneId: string | null,
): string | null {
  return selectedCommunityId ?? activeSceneId ?? null;
}
