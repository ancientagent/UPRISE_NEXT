import { MUSIC_COMMUNITIES } from '@/data/music-communities';
import {
  listDiscoverScenes,
  type DiscoverCitySceneItem,
  type DiscoverItem,
} from '@/lib/discovery/client';
import type { HomeSceneSelection, TunedSceneContext } from '@/store/onboarding';

export type OnboardingReviewResolutionMode =
  | 'exact'
  | 'fallback_state'
  | 'fallback_community'
  | 'unresolved';

export interface OnboardingReviewResolution {
  pioneer: boolean;
  resolutionMode: OnboardingReviewResolutionMode;
  resolvedSceneLabel: string | null;
  stateSceneOptions: string[];
  discoveryContext: {
    tunedSceneId: string;
    tunedScene: TunedSceneContext;
    isVisitor: boolean;
  } | null;
}

type DiscoverScenesReader = typeof listDiscoverScenes;

const APPROVED_MUSIC_COMMUNITY_SET = new Set<string>(MUSIC_COMMUNITIES);

function normalizeText(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? '';
}

function isDiscoverCitySceneItem(item: DiscoverItem): item is DiscoverCitySceneItem {
  return item.entryType === 'city_scene';
}

function isMatchingSelection(item: DiscoverCitySceneItem, selection: HomeSceneSelection): boolean {
  return (
    normalizeText(item.city) === normalizeText(selection.city) &&
    normalizeText(item.state) === normalizeText(selection.state) &&
    normalizeText(item.musicCommunity) === normalizeText(selection.musicCommunity)
  );
}

function buildSceneLabel(city: string | null | undefined, state: string | null | undefined, musicCommunity: string | null | undefined): string {
  const cityLabel = city?.trim();
  const stateLabel = state?.trim();
  const communityLabel = musicCommunity?.trim();

  if (cityLabel && stateLabel && communityLabel) return `${cityLabel}, ${stateLabel} • ${communityLabel}`;
  if (cityLabel && stateLabel) return `${cityLabel}, ${stateLabel}`;
  if (cityLabel && communityLabel) return `${cityLabel} • ${communityLabel}`;
  if (stateLabel && communityLabel) return `${stateLabel} • ${communityLabel}`;
  return cityLabel || stateLabel || communityLabel || '';
}

function buildDiscoveryContext(
  scene: DiscoverCitySceneItem,
  selection: HomeSceneSelection,
): {
  tunedSceneId: string;
  tunedScene: TunedSceneContext;
  isVisitor: boolean;
} {
  return {
    tunedSceneId: scene.sceneId,
    tunedScene: {
      id: scene.sceneId,
      name: scene.name,
      city: scene.city ?? null,
      state: scene.state ?? null,
      musicCommunity: scene.musicCommunity ?? null,
      tier: 'city',
      isActive: scene.isActive,
    },
    isVisitor: !isMatchingSelection(scene, selection),
  };
}

export function isApprovedMusicCommunitySelection(value: string): boolean {
  return APPROVED_MUSIC_COMMUNITY_SET.has(value.trim());
}

export function normalizeApprovedMusicCommunitySelection(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? '';
  return isApprovedMusicCommunitySelection(trimmed) ? trimmed : '';
}

export function formatHomeSceneLabel(selection: HomeSceneSelection | null | undefined): string {
  if (!selection) return '';
  return buildSceneLabel(selection.city, selection.state, selection.musicCommunity);
}

export async function resolveOnboardingReviewState(
  selection: HomeSceneSelection,
  token?: string,
  readScenes: DiscoverScenesReader = listDiscoverScenes,
): Promise<OnboardingReviewResolution> {
  const exactResponse = await readScenes(
    {
      tier: 'city',
      city: selection.city,
      state: selection.state,
      musicCommunity: selection.musicCommunity,
    },
    token,
  );

  const exactScenes = exactResponse.filter(isDiscoverCitySceneItem).filter((item) => isMatchingSelection(item, selection));
  const exactActiveMatch = exactScenes.find((item) => item.isActive) ?? null;

  if (exactActiveMatch) {
    return {
      pioneer: false,
      resolutionMode: 'exact',
      resolvedSceneLabel: buildSceneLabel(
        exactActiveMatch.city,
        exactActiveMatch.state,
        exactActiveMatch.musicCommunity,
      ),
      stateSceneOptions: [],
      discoveryContext: buildDiscoveryContext(exactActiveMatch, selection),
    };
  }

  const stateResponse = await readScenes(
    {
      tier: 'city',
      state: selection.state,
      musicCommunity: selection.musicCommunity,
    },
    token,
  );

  const activeStateScenes = stateResponse
    .filter(isDiscoverCitySceneItem)
    .filter(
      (item) =>
        item.isActive &&
        normalizeText(item.state) === normalizeText(selection.state) &&
        normalizeText(item.musicCommunity) === normalizeText(selection.musicCommunity),
    );

  const sameStateActiveMatch = activeStateScenes[0] ?? null;
  const stateSceneOptions = Array.from(
    new Set(
      activeStateScenes
        .map((item) => buildSceneLabel(item.city, item.state, item.musicCommunity))
        .filter(Boolean),
    ),
  ).slice(0, 8);

  if (sameStateActiveMatch) {
    return {
      pioneer: true,
      resolutionMode: 'fallback_state',
      resolvedSceneLabel: buildSceneLabel(
        sameStateActiveMatch.city,
        sameStateActiveMatch.state,
        sameStateActiveMatch.musicCommunity,
      ),
      stateSceneOptions,
      discoveryContext: buildDiscoveryContext(sameStateActiveMatch, selection),
    };
  }

  const communityResponse = await readScenes(
    {
      tier: 'city',
      musicCommunity: selection.musicCommunity,
    },
    token,
  );

  const anyActiveMatch =
    communityResponse
      .filter(isDiscoverCitySceneItem)
      .find(
        (item) =>
          item.isActive &&
          normalizeText(item.musicCommunity) === normalizeText(selection.musicCommunity),
      ) ?? null;

  if (anyActiveMatch) {
    return {
      pioneer: true,
      resolutionMode: 'fallback_community',
      resolvedSceneLabel: buildSceneLabel(
        anyActiveMatch.city,
        anyActiveMatch.state,
        anyActiveMatch.musicCommunity,
      ),
      stateSceneOptions,
      discoveryContext: buildDiscoveryContext(anyActiveMatch, selection),
    };
  }

  return {
    pioneer: true,
    resolutionMode: 'unresolved',
    resolvedSceneLabel: null,
    stateSceneOptions,
    discoveryContext: null,
  };
}
