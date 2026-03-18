import type { DiscoveryContext, DiscoveryScene } from '@/lib/discovery/client';

export interface DiscoveryContextPatch {
  tunedSceneId: string | null;
  tunedScene: DiscoveryScene | null;
  isVisitor: boolean | null;
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

  if (!primary || !hasPrimaryTransportContext) {
    return fallback;
  }

  return {
    tunedSceneId: primary?.tunedSceneId ?? primary?.tunedScene?.id ?? fallback.tunedSceneId,
    tunedScene: primary?.tunedScene ?? fallback.tunedScene,
    isVisitor: primary?.isVisitor ?? fallback.isVisitor,
  };
}
