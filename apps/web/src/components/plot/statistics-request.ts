export type TierScope = 'city' | 'state' | 'national';

export interface StatisticsEndpointResolution {
  endpoint: string;
  source: 'anchored' | 'active';
}

export interface SceneMapRequestResolution {
  anchorId: string | null;
  endpoint: string | null;
  source: 'selected_community' | 'active_scene' | 'unresolved';
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

export function resolveSceneMapRequest(
  selectedCommunityId: string | null,
  activeSceneId: string | null,
  selectedTier: TierScope,
): SceneMapRequestResolution {
  const anchorId = selectedCommunityId ?? activeSceneId ?? null;

  if (!anchorId) {
    return {
      anchorId: null,
      endpoint: null,
      source: 'unresolved',
    };
  }

  return {
    anchorId,
    endpoint: `/communities/${anchorId}/scene-map?tier=${selectedTier}`,
    source: selectedCommunityId ? 'selected_community' : 'active_scene',
  };
}

export function resolveSceneMapAnchorId(
  selectedCommunityId: string | null,
  activeSceneId: string | null,
): string | null {
  return selectedCommunityId ?? activeSceneId ?? null;
}
