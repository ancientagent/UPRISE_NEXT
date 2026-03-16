export type PlotTier = 'city' | 'state' | 'national';

interface BroadcastAnchor {
  name?: string | null;
  city?: string | null;
  state?: string | null;
  musicCommunity?: string | null;
}

// Canon guard: tier switching is structural (city/state/national), not radius expansion.
export function shouldFetchNearbyForTier(tier: PlotTier): boolean {
  return tier === 'city';
}

function normalizeLabelPart(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function buildRadiyoBroadcastLabel(
  tier: PlotTier,
  anchor: BroadcastAnchor | null,
  homeScene: BroadcastAnchor | null,
): string {
  const city = normalizeLabelPart(anchor?.city) ?? normalizeLabelPart(homeScene?.city);
  const state = normalizeLabelPart(anchor?.state) ?? normalizeLabelPart(homeScene?.state);
  const musicCommunity =
    normalizeLabelPart(anchor?.musicCommunity) ??
    normalizeLabelPart(homeScene?.musicCommunity) ??
    normalizeLabelPart(anchor?.name) ??
    'UPRISE';

  if (tier === 'city') {
    if (city && state) {
      return `${city}, ${state} • ${musicCommunity}`;
    }

    if (city) {
      return `${city} • ${musicCommunity}`;
    }
  }

  if (tier === 'state') {
    if (state) {
      return `${state} • ${musicCommunity}`;
    }
  }

  if (tier === 'national') {
    return `National • ${musicCommunity}`;
  }

  return musicCommunity;
}
