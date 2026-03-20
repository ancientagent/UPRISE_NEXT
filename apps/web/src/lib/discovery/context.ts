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

  const primarySceneId = tunedSceneId ?? primaryScene.id;
  const normalizedPrimaryScene =
    primarySceneId && primaryScene.id !== primarySceneId
      ? {
          ...primaryScene,
          id: primarySceneId,
        }
      : primaryScene;

  if (!fallbackScene) return normalizedPrimaryScene;

  if (primarySceneId && fallbackScene.id !== primarySceneId) {
    return normalizedPrimaryScene;
  }

  return {
    ...fallbackScene,
    ...normalizedPrimaryScene,
    id: primarySceneId ?? fallbackScene.id,
    name: coalesceSceneString(normalizedPrimaryScene.name, fallbackScene.name) ?? '',
    city: coalesceSceneString(normalizedPrimaryScene.city, fallbackScene.city),
    state: coalesceSceneString(normalizedPrimaryScene.state, fallbackScene.state),
    musicCommunity: coalesceSceneString(normalizedPrimaryScene.musicCommunity, fallbackScene.musicCommunity),
    tier: coalesceSceneString(normalizedPrimaryScene.tier, fallbackScene.tier) ?? fallbackScene.tier,
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
