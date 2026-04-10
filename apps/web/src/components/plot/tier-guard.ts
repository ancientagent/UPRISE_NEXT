export type PlotTier = 'city' | 'state' | 'national';
export type MvpPlotTier = Exclude<PlotTier, 'national'>;

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

export function shouldUseTunedSceneAsDefaultPlotAnchor(
  tunedScene: { tier?: string | null } | null | undefined,
): boolean {
  return tunedScene?.tier === 'city';
}

export function getMvpPlayerTier(tunedTier?: string | null): MvpPlotTier {
  return tunedTier === 'state' || tunedTier === 'national' ? 'state' : 'city';
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
