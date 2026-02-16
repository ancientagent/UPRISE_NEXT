import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { HomeSceneSelectionDto, GpsVerifyDto } from './dto/onboarding.dto';

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function buildCommunitySlug(city: string, state: string, musicCommunity: string): string {
  const base = slugify(`${city}-${state}-${musicCommunity}`);
  // Ensure non-empty + keep reasonable uniqueness without needing a lookup.
  const suffix = Math.random().toString(36).slice(2, 6);
  return base ? `${base}-${suffix}` : `community-${suffix}`;
}

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async setHomeScene(userId: string, dto: HomeSceneSelectionDto) {
    const city = dto.city.trim();
    const state = dto.state.trim();
    const musicCommunity = dto.musicCommunity.trim();
    const tasteTag = dto.tasteTag?.trim() || null;

    // We treat the Home Scene as a City-tier Community container.
    // If it doesn't exist yet, we create it as inactive (pioneer) and still allow the user to affiliate.
    let resolvedScene = await this.prisma.community.findFirst({
      where: { city, state, musicCommunity, tier: 'city' },
      select: { id: true, city: true, state: true, musicCommunity: true, isActive: true },
    });

    const appliedTags: string[] = [];
    let pioneer = false;

    if (!resolvedScene) {
      pioneer = true;
      resolvedScene = await this.prisma.community.create({
        data: {
          name: `${city}, ${state} ${musicCommunity}`,
          slug: buildCommunitySlug(city, state, musicCommunity),
          description: `Local music community for ${musicCommunity} in ${city}, ${state}.`,
          city,
          state,
          musicCommunity,
          tier: 'city',
          isActive: false,
          // createdById is required; tie it to the first pioneer by default.
          createdById: userId,
        },
        select: { id: true, city: true, state: true, musicCommunity: true, isActive: true },
      });
    } else {
      pioneer = !resolvedScene.isActive;
    }

    const inferredTag = tasteTag || (appliedTags.length > 0 ? appliedTags[0] : null);

    const user = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          homeSceneCity: city,
          homeSceneState: state,
          homeSceneCommunity: resolvedScene.musicCommunity,
          homeSceneTag: inferredTag,
        },
        select: {
          id: true,
          homeSceneCity: true,
          homeSceneState: true,
          homeSceneCommunity: true,
          homeSceneTag: true,
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

    const community = await this.prisma.community.findFirst({
      where: {
        city: user.homeSceneCity,
        state: user.homeSceneState,
        musicCommunity: user.homeSceneCommunity,
        tier: 'city',
      },
      select: { id: true, radius: true },
    });

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
      distance,
      reason,
    };
  }
}
