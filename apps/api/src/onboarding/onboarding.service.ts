import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { HomeSceneSelectionDto, GpsVerifyDto } from './dto/onboarding.dto';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async setHomeScene(userId: string, dto: HomeSceneSelectionDto) {
    const city = dto.city.trim();
    const state = dto.state.trim();
    const musicCommunity = dto.musicCommunity.trim();
    const tasteTag = dto.tasteTag?.trim() || null;

    let resolvedScene = await this.prisma.community.findFirst({
      where: {
        city,
        state,
        musicCommunity,
        tier: 'city',
        isActive: true,
      },
      select: { id: true, city: true, state: true, musicCommunity: true, isActive: true },
    });

    const appliedTags: string[] = [];
    let pioneer = false;

    if (!resolvedScene) {
      const sectMatch = await this.prisma.sectTag.findFirst({
        where: {
          name: musicCommunity,
          parentCommunity: {
            city,
            state,
            tier: 'city',
            isActive: true,
          },
        },
        include: { parentCommunity: true },
      });

      if (sectMatch) {
        resolvedScene = {
          id: sectMatch.parentCommunity.id,
          city: sectMatch.parentCommunity.city,
          state: sectMatch.parentCommunity.state,
          musicCommunity: sectMatch.parentCommunity.musicCommunity,
          isActive: sectMatch.parentCommunity.isActive,
        };
        appliedTags.push(sectMatch.name);
      }
    }

    if (!resolvedScene) {
      const parentScene = await this.prisma.community.findFirst({
        where: {
          city,
          state,
          musicCommunity,
          tier: 'city',
        },
        select: { id: true, city: true, state: true, musicCommunity: true, isActive: true },
      });

      if (parentScene) {
        resolvedScene = parentScene;
        pioneer = !parentScene.isActive;
      } else {
        pioneer = true;
      }
    }

    const inferredTag = tasteTag || (appliedTags.length > 0 ? appliedTags[0] : null);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        homeSceneCity: city,
        homeSceneState: state,
        homeSceneCommunity: resolvedScene?.musicCommunity ?? musicCommunity,
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

    const tagsToApply = new Set(appliedTags);
    if (tasteTag) tagsToApply.add(tasteTag);

    if (resolvedScene && tagsToApply.size > 0) {
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
      sceneId: resolvedScene?.id ?? null,
      appliedTags: Array.from(tagsToApply),
      votingEligible: user.gpsVerified,
      pioneer,
    };
  }

  async verifyGps(userId: string, dto: GpsVerifyDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        gpsVerified: true,
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
  }
}
