
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { COLLECTION_SHELVES } from '../common/constants/collection-shelves';

type MusicCommunityPreferenceRecord = {
  id: string;
  userId: string;
  musicCommunity: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type HomeSceneSelectorScene = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  musicCommunity: string | null;
  tier: string;
  isActive: boolean;
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private formatMusicCommunityPreference(preference: MusicCommunityPreferenceRecord) {
    return {
      id: preference.id,
      musicCommunity: preference.musicCommunity,
      isDefault: preference.isDefault,
      createdAt: preference.createdAt.toISOString(),
      updatedAt: preference.updatedAt.toISOString(),
    };
  }

  private async findMusicCommunityPreferences(userId: string) {
    return this.prisma.userMusicCommunityPreference.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }, { musicCommunity: 'asc' }],
    });
  }

  private normalizeMusicCommunity(musicCommunity: string) {
    const normalized = musicCommunity.trim();
    if (!normalized) {
      throw new BadRequestException('Music community is required');
    }
    return normalized;
  }

  async listMusicCommunityPreferences(userId: string) {
    let preferences = await this.findMusicCommunityPreferences(userId);
    if (preferences.length > 0) {
      return preferences.map((preference) => this.formatMusicCommunityPreference(preference));
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, homeSceneCommunity: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentMusicCommunity = user.homeSceneCommunity?.trim();
    if (!currentMusicCommunity) {
      return [];
    }

    await this.prisma.userMusicCommunityPreference.upsert({
      where: { userId_musicCommunity: { userId, musicCommunity: currentMusicCommunity } },
      update: { isDefault: true },
      create: { userId, musicCommunity: currentMusicCommunity, isDefault: true },
    });

    preferences = await this.findMusicCommunityPreferences(userId);
    return preferences.map((preference) => this.formatMusicCommunityPreference(preference));
  }

  async addMusicCommunityPreference(userId: string, musicCommunity: string) {
    const normalized = this.normalizeMusicCommunity(musicCommunity);
    const currentPreferences = await this.listMusicCommunityPreferences(userId);
    const shouldDefault = currentPreferences.length === 0;

    await this.prisma.userMusicCommunityPreference.upsert({
      where: { userId_musicCommunity: { userId, musicCommunity: normalized } },
      update: {},
      create: { userId, musicCommunity: normalized, isDefault: shouldDefault },
    });

    return this.listMusicCommunityPreferences(userId);
  }

  async setDefaultMusicCommunityPreference(userId: string, musicCommunity: string) {
    const normalized = this.normalizeMusicCommunity(musicCommunity);
    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const preference = await tx.userMusicCommunityPreference.findUnique({
        where: { userId_musicCommunity: { userId, musicCommunity: normalized } },
      });
      if (!preference) {
        throw new NotFoundException('Music community preference not found');
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, homeSceneCity: true, homeSceneState: true },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const city = user.homeSceneCity?.trim();
      const state = user.homeSceneState?.trim();
      if (!city || !state) {
        throw new BadRequestException('Home Scene location is required before changing the default music community');
      }

      const resolved = await this.resolveActiveHomeSceneForPreference(city, state, normalized, tx);
      if (!resolved) {
        throw new BadRequestException('No active Home Scene is available for this music community');
      }

      await tx.userMusicCommunityPreference.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
      await tx.userMusicCommunityPreference.update({
        where: { id: preference.id },
        data: { isDefault: true },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          homeSceneCommunity: normalized,
          homeSceneId: resolved.scene.id,
          tunedSceneId: resolved.scene.id,
          tunedSceneUpdatedAt: new Date(),
        },
      });

      const membership = await tx.communityMember.createMany({
        data: [{ userId, communityId: resolved.scene.id, role: 'member' }],
        skipDuplicates: true,
      });
      if (membership.count === 1) {
        await tx.community.update({
          where: { id: resolved.scene.id },
          data: { memberCount: { increment: 1 } },
        });
      }
    });

    return this.listMusicCommunityPreferences(userId);
  }

  async resolveActiveHomeSceneForPreference(
    city: string,
    state: string,
    musicCommunity: string,
    client: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<{ scene: HomeSceneSelectorScene; resolution: 'natural' | 'proxy' } | null> {
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

    const exactScene = await client.community.findFirst({
      where: { city, state, musicCommunity, tier: 'city', isActive: true },
      select,
    });
    if (exactScene) {
      return { scene: exactScene, resolution: 'natural' };
    }

    const sameStateProxy = await client.community.findFirst({
      where: { state, musicCommunity, tier: 'city', isActive: true },
      select,
      orderBy,
    });
    if (sameStateProxy) {
      return { scene: sameStateProxy, resolution: 'proxy' };
    }

    const anyProxy = await client.community.findFirst({
      where: { musicCommunity, tier: 'city', isActive: true },
      select,
      orderBy,
    });
    if (anyProxy) {
      return { scene: anyProxy, resolution: 'proxy' };
    }

    return null;
  }

  async getHomeSceneSelector(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        homeSceneCity: true,
        homeSceneState: true,
        homeSceneCommunity: true,
        tunedSceneId: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.listMusicCommunityPreferences(userId);
    const preferences = await this.findMusicCommunityPreferences(userId);
    const city = user.homeSceneCity?.trim();
    const state = user.homeSceneState?.trim();

    if (!city || !state) {
      return {
        currentLocation: null,
        items: [],
      };
    }

    const items = [];
    for (const preference of preferences) {
      const resolved = await this.resolveActiveHomeSceneForPreference(city, state, preference.musicCommunity);
      if (!resolved) continue;

      items.push({
        preferenceId: preference.id,
        musicCommunity: preference.musicCommunity,
        isDefault: preference.isDefault,
        sceneId: resolved.scene.id,
        sceneName: resolved.scene.name,
        city: resolved.scene.city,
        state: resolved.scene.state,
        resolution: resolved.resolution,
        isCurrent: user.tunedSceneId === resolved.scene.id,
      });
    }

    return {
      currentLocation: { city, state },
      items,
    };
  }

  async create(data: {
    email: string;
    username: string;
    displayName: string;
    password: string;
    city?: string;
    homeSceneCity?: string;
    homeSceneState?: string;
    homeSceneCommunity?: string;
    gpsVerified?: boolean;
  }) {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        coverImage: true,
        city: true,
        country: true,
        collectionDisplayEnabled: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const artistBandCount = await this.prisma.artistBandMember.count({
      where: { userId: id },
    });
    const managedArtistBands = await this.prisma.artistBand.findMany({
      where: {
        members: {
          some: {
            userId: id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        entityType: true,
        members: {
          where: { userId: id },
          select: { role: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return {
      ...user,
      hasArtistBand: artistBandCount > 0,
      managedArtistBands: managedArtistBands.map((artistBand: any) => ({
        id: artistBand.id,
        name: artistBand.name,
        slug: artistBand.slug,
        entityType: artistBand.entityType,
        membershipRole: artistBand.members[0]?.role ?? null,
      })),
    };
  }

  async setCollectionDisplay(userId: string, enabled: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { collectionDisplayEnabled: enabled },
      select: {
        id: true,
        collectionDisplayEnabled: true,
      },
    });
  }

  async getProfileWithCollection(viewerUserId: string, targetUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        coverImage: true,
        city: true,
        country: true,
        collectionDisplayEnabled: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const canViewCollection = viewerUserId === targetUserId || user.collectionDisplayEnabled;
    let collectionShelves: Array<{
      shelf: string;
      itemCount: number;
      items: Array<{
        signalId: string;
        type: string;
        createdAt: string;
        metadata: Record<string, unknown> | null;
      }>;
    }> = [];
    let savedAwayScenes: Array<{
      id: string;
      reason: string;
      savedAt: string;
      context: Record<string, unknown> | null;
      scene: {
        id: string;
        name: string;
        city: string | null;
        state: string | null;
        musicCommunity: string | null;
        tier: string;
        isActive: boolean;
      };
    }> = [];

    if (canViewCollection) {
      const collections = await this.prisma.collection.findMany({
        where: { userId: targetUserId },
        include: {
          items: {
            include: {
              signal: {
                select: {
                  id: true,
                  type: true,
                  metadata: true,
                  createdAt: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      const byName = new Map<
        string,
        {
          name: string;
          items: Array<{
            createdAt: Date;
            signal: {
              id: string;
              type: string;
              metadata: unknown;
              createdAt: Date;
            };
          }>;
        }
      >(
        collections.map((collection: {
          name: string;
          items: Array<{
            createdAt: Date;
            signal: {
              id: string;
              type: string;
              metadata: unknown;
              createdAt: Date;
            };
          }>;
        }) => [collection.name, collection]),
      );
      collectionShelves = COLLECTION_SHELVES.map((shelf) => {
        const collection = byName.get(shelf);
        const items = (collection?.items ?? []).map((item: {
          createdAt: Date;
          signal: {
            id: string;
            type: string;
            metadata: unknown;
            createdAt: Date;
          };
        }) => ({
          signalId: item.signal.id,
          type: item.signal.type,
          metadata: (item.signal.metadata as Record<string, unknown> | null) ?? null,
          createdAt: item.createdAt.toISOString(),
        }));

        return {
          shelf,
          itemCount: items.length,
          items,
        };
      });

      const savedScenes = await this.prisma.userSavedScene.findMany({
        where: { userId: targetUserId },
        include: {
          community: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
              musicCommunity: true,
              tier: true,
              isActive: true,
            },
          },
        },
        orderBy: [{ savedAt: 'desc' }, { id: 'asc' }],
      });

      savedAwayScenes = savedScenes.map((savedScene: {
        id: string;
        reason: string;
        savedAt: Date;
        context: unknown;
        community: {
          id: string;
          name: string;
          city: string | null;
          state: string | null;
          musicCommunity: string | null;
          tier: string;
          isActive: boolean;
        };
      }) => ({
        id: savedScene.id,
        reason: savedScene.reason,
        savedAt: savedScene.savedAt.toISOString(),
        context: (savedScene.context as Record<string, unknown> | null) ?? null,
        scene: savedScene.community,
      }));
    }

    const activationNotices =
      viewerUserId !== targetUserId
        ? []
        : await this.prisma.userActivationNotice.findMany({
            where: { userId: targetUserId, status: 'unread' },
            include: {
              fromScene: {
                select: {
                  id: true,
                  name: true,
                  city: true,
                  state: true,
                  musicCommunity: true,
                  tier: true,
                  isActive: true,
                },
              },
              toScene: {
                select: {
                  id: true,
                  name: true,
                  city: true,
                  state: true,
                  musicCommunity: true,
                  tier: true,
                  isActive: true,
                },
              },
            },
            orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
            take: 5,
          });

    const artistBandCount = await this.prisma.artistBandMember.count({
      where: { userId: targetUserId },
    });
    const managedArtistBands = await this.prisma.artistBand.findMany({
      where: {
        members: {
          some: {
            userId: targetUserId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        entityType: true,
        members: {
          where: { userId: targetUserId },
          select: { role: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return {
      user: {
        ...user,
        hasArtistBand: artistBandCount > 0,
      },
      canViewCollection,
      collectionShelves,
      savedAwayScenes,
      activationNotices: activationNotices.map((notice: {
        id: string;
        reason: string;
        status: string;
        message: string | null;
        city: string;
        state: string;
        musicCommunity: string;
        createdAt: Date;
        fromScene: {
          id: string;
          name: string;
          city: string | null;
          state: string | null;
          musicCommunity: string | null;
          tier: string;
          isActive: boolean;
        } | null;
        toScene: {
          id: string;
          name: string;
          city: string | null;
          state: string | null;
          musicCommunity: string | null;
          tier: string;
          isActive: boolean;
        };
      }) => ({
        id: notice.id,
        reason: notice.reason,
        status: notice.status,
        message: notice.message,
        city: notice.city,
        state: notice.state,
        musicCommunity: notice.musicCommunity,
        createdAt: notice.createdAt.toISOString(),
        fromScene: notice.fromScene,
        toScene: notice.toScene,
      })),
      managedArtistBands: managedArtistBands.map((artistBand: any) => ({
        id: artistBand.id,
        name: artistBand.name,
        slug: artistBand.slug,
        entityType: artistBand.entityType,
        membershipRole: artistBand.members[0]?.role ?? null,
      })),
    };
  }

  async findMany(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ skip, take: limit }),
      this.prisma.user.count(),
    ]);

    return { users, total, page, limit };
  }
}
