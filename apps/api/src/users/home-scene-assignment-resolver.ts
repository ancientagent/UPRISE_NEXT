import type { PrismaService } from '../prisma/prisma.service';

export type ResolvedHomeSceneAssignment = {
  scene: {
    id: string;
    name: string;
    city: string | null;
    state: string | null;
    musicCommunity: string | null;
    tier: string;
    isActive: boolean;
  };
  resolution: 'natural' | 'proxy';
};

/**
 * Resolve the active natural/proxy Home Scene carried by a submitted locality
 * and music-community preference. This deliberately ignores tunedSceneId,
 * which may point at a transient Away Scene.
 */
export async function resolveHomeSceneAssignment(
  prisma: PrismaService,
  city: string,
  state: string,
  musicCommunity: string,
): Promise<ResolvedHomeSceneAssignment | null> {
  const select = {
    id: true,
    name: true,
    city: true,
    state: true,
    musicCommunity: true,
    tier: true,
    isActive: true,
  };
  const orderBy = [{ memberCount: 'desc' as const }, { name: 'asc' as const }, { id: 'asc' as const }];

  const exactScene = await prisma.community.findFirst({
    where: { city, state, musicCommunity, tier: 'city', isActive: true },
    select,
  });
  if (exactScene) return { scene: exactScene, resolution: 'natural' };

  const sameStateProxy = await prisma.community.findFirst({
    where: { state, musicCommunity, tier: 'city', isActive: true },
    select,
    orderBy,
  });
  if (sameStateProxy) return { scene: sameStateProxy, resolution: 'proxy' };

  const anyProxy = await prisma.community.findFirst({
    where: { musicCommunity, tier: 'city', isActive: true },
    select,
    orderBy,
  });
  if (anyProxy) return { scene: anyProxy, resolution: 'proxy' };

  return null;
}
