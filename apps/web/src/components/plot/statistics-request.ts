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

export function getSceneMapScopeCopy(selectedTier: TierScope): string {
  if (selectedTier === 'city') {
    return 'City view keeps local scene-map detail for the active Plot context.';
  }

  if (selectedTier === 'state') {
    return 'State view keeps the same parent context and rolls the map up to city-level macro reads.';
  }

  return 'National view keeps the same parent context and rolls the map up to state-level macro reads.';
}

export function getSceneMapResolutionCopy(
  source: SceneMapRequestResolution['source'],
  selectedTier: TierScope,
): string {
  if (source === 'selected_community') {
    return selectedTier === 'city'
      ? 'Map anchor source: selected community.'
      : 'Map anchor source: selected community, preserving the current parent-context rollup.';
  }

  if (source === 'active_scene') {
    return selectedTier === 'city'
      ? 'Map anchor source: active scene fallback.'
      : 'Map anchor source: active scene fallback, preserving the current parent-context rollup.';
  }

  return 'Map anchor source: unresolved until a statistics context is available.';
}
