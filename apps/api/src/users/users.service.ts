
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { COLLECTION_SHELVES } from '../common/constants/collection-shelves';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
      managedArtistBands: managedArtistBands.map((artistBand) => ({
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
      managedArtistBands: managedArtistBands.map((artistBand) => ({
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
