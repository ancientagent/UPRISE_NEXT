
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    const preference = await this.prisma.userMusicCommunityPreference.findUnique({
      where: { userId_musicCommunity: { userId, musicCommunity: normalized } },
    });

    if (!preference) {
      throw new NotFoundException('Music community preference not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.userMusicCommunityPreference.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
      await tx.userMusicCommunityPreference.update({
        where: { id: preference.id },
        data: { isDefault: true },
      });
    });

    return this.listMusicCommunityPreferences(userId);
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
    }

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
