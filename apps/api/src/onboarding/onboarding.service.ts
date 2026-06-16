import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type {
  HomeSceneSelectionDto,
  GpsVerifyDto,
  MusicCommunityRequestDto,
} from './dto/onboarding.dto';

function normalizeIntakeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizeIntakeKey(value: string): string {
  return normalizeIntakeText(value).toLowerCase();
}

function formatSceneLabel(scene: {
  city: string | null;
  state: string | null;
  musicCommunity: string | null;
}): string {
  const city = scene.city?.trim();
  const state = scene.state?.trim();
  const musicCommunity = scene.musicCommunity?.trim();

  if (city && state && musicCommunity) return `${city}, ${state} • ${musicCommunity}`;
  if (city && state) return `${city}, ${state}`;
  if (city && musicCommunity) return `${city} • ${musicCommunity}`;
  if (state && musicCommunity) return `${state} • ${musicCommunity}`;
  return city || state || musicCommunity || '';
}

type ResolvedHomeScene = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  musicCommunity: string | null;
  isActive: boolean;
};

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  private async resolveActiveFallbackScene(
    state: string,
    musicCommunity: string
  ): Promise<ResolvedHomeScene | null> {
    const select = {
      id: true,
      name: true,
      city: true,
      state: true,
      musicCommunity: true,
      isActive: true,
      memberCount: true,
    };
    const orderBy = [
      { memberCount: 'desc' as const },
      { name: 'asc' as const },
      { id: 'asc' as const },
    ];

    const sameStateMatches = await this.prisma.community.findMany({
      where: { tier: 'city', musicCommunity, state, isActive: true },
      select,
      orderBy,
      take: 1,
    });

    if (sameStateMatches[0]) return sameStateMatches[0];

    const communityMatches = await this.prisma.community.findMany({
      where: { tier: 'city', musicCommunity, isActive: true },
      select,
      orderBy,
      take: 1,
    });

    return communityMatches[0] ?? null;
  }

  async setHomeScene(userId: string, dto: HomeSceneSelectionDto) {
    const city = dto.city.trim();
    const state = dto.state.trim();
    const musicCommunity = dto.musicCommunity.trim();
    const tasteTag = dto.tasteTag?.trim() || null;

    const exactScene = await this.prisma.community.findFirst({
      where: { city, state, musicCommunity, tier: 'city' },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        musicCommunity: true,
        isActive: true,
      },
    });

    const appliedTags: string[] = [];
    const pioneer = !exactScene?.isActive;
    const resolvedScene = exactScene?.isActive
      ? exactScene
      : await this.resolveActiveFallbackScene(state, musicCommunity);

    if (!resolvedScene) {
      throw new BadRequestException({
        success: false,
        error: { message: 'No active city scene is available for the selected music community' },
      });
    }

    const inferredTag = tasteTag || (appliedTags.length > 0 ? appliedTags[0] : null);

    const user = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          homeSceneCity: city,
          homeSceneState: state,
          homeSceneCommunity: musicCommunity,
          homeSceneTag: inferredTag,
          tunedSceneId: resolvedScene.id,
          tunedSceneUpdatedAt: new Date(),
        },
        select: {
          id: true,
          homeSceneCity: true,
          homeSceneState: true,
          homeSceneCommunity: true,
          homeSceneTag: true,
          tunedSceneId: true,
          gpsVerified: true,
        },
      });

      // Auto-join the resolved Home Scene.
      // Only increment memberCount if the membership is newly created.
      try {
        await tx.communityMember.create({
          data: { userId, communityId: resolvedScene.id, role: 'member' },
        });
        await tx.community.update({
          where: { id: resolvedScene.id },
          data: { memberCount: { increment: 1 } },
        });
      } catch (error: any) {
        // Unique constraint violation => already a member
        if (error?.code !== 'P2002') throw error;
      }

      return updatedUser;
    });

    const tagsToApply = new Set(appliedTags);
    if (tasteTag) tagsToApply.add(tasteTag);

    if (tagsToApply.size > 0) {
      for (const tagName of tagsToApply) {
        const tag = await this.prisma.sectTag.upsert({
          where: { name_parentCommunityId: { name: tagName, parentCommunityId: resolvedScene.id } },
          update: {},
          create: {
            name: tagName,
            status: resolvedScene.isActive ? 'active' : 'incubating',
            parentCommunityId: resolvedScene.id,
          },
        });

        await this.prisma.userTag.upsert({
          where: { userId_sectTagId: { userId, sectTagId: tag.id } },
          update: {},
          create: { userId, sectTagId: tag.id },
        });
      }
    }

    return {
      ...user,
      sceneId: resolvedScene.id,
      resolvedCitySceneId: resolvedScene.id,
      resolvedCitySceneLabel: formatSceneLabel(resolvedScene),
      pioneerHomeScene: pioneer ? { city, state, musicCommunity } : null,
      appliedTags: Array.from(tagsToApply),
      votingEligible: user.gpsVerified,
      pioneer,
    };
  }

  async verifyGps(userId: string, dto: GpsVerifyDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        homeSceneCity: true,
        homeSceneState: true,
        homeSceneCommunity: true,
        tunedSceneId: true,
      },
    });

    // If the user hasn't selected a Home Scene yet, we can store coords but cannot grant voting.
    if (!user?.homeSceneCity || !user?.homeSceneState || !user?.homeSceneCommunity) {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          gpsVerified: false,
          latitude: dto.latitude,
          longitude: dto.longitude,
        },
        select: { id: true, gpsVerified: true, latitude: true, longitude: true },
      });
      return { ...updated, votingEligible: false, reason: 'NO_HOME_SCENE' as const };
    }

    const exactCommunity = await this.prisma.community.findFirst({
      where: {
        city: user.homeSceneCity,
        state: user.homeSceneState,
        musicCommunity: user.homeSceneCommunity,
        tier: 'city',
      },
      select: { id: true, radius: true, isActive: true },
    });
    const community = exactCommunity?.isActive
      ? exactCommunity
      : user.tunedSceneId
        ? await this.prisma.community.findUnique({
            where: { id: user.tunedSceneId },
            select: { id: true, radius: true },
          })
        : null;

    let within = false;
    let distance: number | null = null;
    let reason: string | null = null;

    if (!community) {
      reason = 'SCENE_NOT_FOUND';
    } else {
      // Verify geofence is configured (geofence is Unsupported in Prisma schema, so check via raw SQL).
      const hasGeofence = await this.prisma.$queryRaw<Array<{ has_geofence: boolean }>>`
        SELECT (geofence IS NOT NULL AND radius IS NOT NULL) as has_geofence
        FROM communities
        WHERE id = ${community.id}
      `;

      if (!hasGeofence[0]?.has_geofence) {
        reason = 'SCENE_NO_GEOFENCE';
      } else {
        const userPoint = `POINT(${dto.longitude} ${dto.latitude})`;
        const result = await this.prisma.$queryRaw<Array<{ within: boolean; distance: number }>>`
          SELECT 
            ST_DWithin(
              geofence,
              ST_GeogFromText(${userPoint}),
              radius
            ) as within,
            ST_Distance(geofence, ST_GeogFromText(${userPoint})) as distance
          FROM communities
          WHERE id = ${community.id}
        `;

        within = Boolean(result[0]?.within);
        distance = typeof result[0]?.distance === 'number' ? Math.round(result[0].distance) : null;
        reason = within ? null : 'OUTSIDE_GEOFENCE';
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        gpsVerified: within,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
      select: {
        id: true,
        gpsVerified: true,
        latitude: true,
        longitude: true,
      },
    });

    return {
      ...updated,
      votingEligible: updated.gpsVerified,
      votingSceneId: community?.id ?? null,
      distance,
      reason,
    };
  }

  async requestMusicCommunity(userId: string, dto: MusicCommunityRequestDto) {
    const requestedName = normalizeIntakeText(dto.requestedName);
    const city = normalizeIntakeText(dto.city);
    const state = normalizeIntakeText(dto.state);
    const requestedNameNormalized = normalizeIntakeKey(requestedName);
    const cityNormalized = normalizeIntakeKey(city);
    const stateNormalized = normalizeIntakeKey(state);

    const request = await this.prisma.musicCommunityRequest.upsert({
      where: {
        userId_requestedNameNormalized_cityNormalized_stateNormalized: {
          userId,
          requestedNameNormalized,
          cityNormalized,
          stateNormalized,
        },
      },
      update: {
        requestedName,
        city,
        state,
        status: 'submitted',
      },
      create: {
        userId,
        requestedName,
        requestedNameNormalized,
        city,
        cityNormalized,
        state,
        stateNormalized,
        status: 'submitted',
      },
      select: {
        id: true,
        requestedName: true,
        city: true,
        state: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const [distinctRequesters, distinctCities] = await Promise.all([
      this.prisma.musicCommunityRequest.findMany({
        where: { requestedNameNormalized, status: 'submitted' },
        distinct: ['userId'],
        select: { userId: true },
      }),
      this.prisma.musicCommunityRequest.findMany({
        where: { requestedNameNormalized, status: 'submitted' },
        distinct: ['cityNormalized', 'stateNormalized'],
        select: { cityNormalized: true, stateNormalized: true },
      }),
    ]);

    return {
      ...request,
      reviewSignals: {
        distinctRequesterCount: distinctRequesters.length,
        distinctCityCount: distinctCities.length,
      },
    };
  }
}
