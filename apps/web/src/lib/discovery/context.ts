import type { DiscoveryContext, DiscoveryScene } from '@/lib/discovery/client';

export interface DiscoveryContextPatch {
  tunedSceneId: string | null;
  tunedScene: DiscoveryScene | null;
  isVisitor: boolean | null;
}

function coalesceSceneString(primary: string | null | undefined, fallback: string | null) {
  return primary?.trim() || fallback;
}

function mergeDiscoveryScene(
  primaryScene: DiscoveryScene | null | undefined,
  fallbackScene: DiscoveryScene | null,
  tunedSceneId: string | null,
): DiscoveryScene | null {
  if (!primaryScene) return fallbackScene;
  if (!fallbackScene) return primaryScene;

  const primarySceneId = primaryScene.id ?? tunedSceneId;

  if (primarySceneId && fallbackScene.id !== primarySceneId) {
    return primaryScene;
  }

  return {
    ...fallbackScene,
    ...primaryScene,
    id: primarySceneId ?? fallbackScene.id,
    name: coalesceSceneString(primaryScene.name, fallbackScene.name) ?? '',
    city: coalesceSceneString(primaryScene.city, fallbackScene.city),
    state: coalesceSceneString(primaryScene.state, fallbackScene.state),
    musicCommunity: coalesceSceneString(primaryScene.musicCommunity, fallbackScene.musicCommunity),
    tier: coalesceSceneString(primaryScene.tier, fallbackScene.tier) ?? fallbackScene.tier,
  };
}

export function toDiscoveryContextPatch(context: DiscoveryContext | null): DiscoveryContextPatch {
  return {
    tunedSceneId: context?.tunedSceneId ?? context?.tunedScene?.id ?? null,
    tunedScene: context?.tunedScene ?? null,
    isVisitor: context?.isVisitor ?? null,
  };
}

export function mergeDiscoveryContextPatch(
  primary: DiscoveryContext | null,
  fallback: DiscoveryContextPatch,
): DiscoveryContextPatch {
  const hasPrimaryTransportContext = Boolean(primary?.tunedSceneId || primary?.tunedScene);
  const tunedSceneId = primary?.tunedSceneId ?? primary?.tunedScene?.id ?? fallback.tunedSceneId;

  if (!primary || !hasPrimaryTransportContext) {
    return fallback;
  }

  return {
    tunedSceneId,
    tunedScene: mergeDiscoveryScene(primary?.tunedScene, fallback.tunedScene, tunedSceneId),
    isVisitor: primary?.isVisitor ?? fallback.isVisitor,
  };
}
