import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistBandsService {
  constructor(private prisma: PrismaService) {}

  private async getArtistBandOrThrow(id: string) {
    const artistBand = await this.prisma.artistBand.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            displayName: true,
            bio: true,
            avatar: true,
            coverImage: true,
          },
        },
        homeScene: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            state: true,
            musicCommunity: true,
            tier: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!artistBand) {
      throw new NotFoundException('Artist/Band entity not found');
    }

    return artistBand;
  }

  private async findArtistBandSignal(artistBandId: string) {
    return this.prisma.signal.findFirst({
      where: {
        type: 'artist_band',
        metadata: {
          path: ['artistBandId'],
          equals: artistBandId,
        } as any,
      },
      select: {
        id: true,
      },
      orderBy: [{ createdAt: 'asc' }],
    });
  }

  private async getOrCreateArtistBandSignalId(artistBandId: string) {
    const artistBand = await this.getArtistBandOrThrow(artistBandId);
    const existing = await this.findArtistBandSignal(artistBandId);
    if (existing) {
      return existing.id;
    }

    const created = await this.prisma.signal.create({
      data: {
        type: 'artist_band',
        communityId: artistBand.homeSceneId ?? null,
        createdById: artistBand.createdById,
        metadata: {
          kind: 'artist_band',
          artistBandId: artistBand.id,
          name: artistBand.name,
          slug: artistBand.slug,
          entityType: artistBand.entityType,
          homeSceneId: artistBand.homeSceneId,
        },
      },
      select: {
        id: true,
      },
    });

    return created.id;
  }

  async findOne(id: string) {
    const artistBand = await this.getArtistBandOrThrow(id);

    return {
      id: artistBand.id,
      name: artistBand.name,
      slug: artistBand.slug,
      entityType: artistBand.entityType,
      registrarEntryRef: artistBand.registrarEntryRef,
      createdAt: artistBand.createdAt,
      updatedAt: artistBand.updatedAt,
      createdBy: {
        id: artistBand.createdBy.id,
        username: artistBand.createdBy.username,
        displayName: artistBand.createdBy.displayName,
      },
      homeScene: artistBand.homeScene,
      members: artistBand.members.map((member: any) => ({
        userId: member.userId,
        role: member.role,
        createdAt: member.createdAt,
        user: member.user,
      })),
      memberCount: artistBand.members.length,
    };
  }

  async findProfile(id: string) {
    const artistBand = await this.getArtistBandOrThrow(id);
    const memberUserIds = artistBand.members.map((member) => member.userId);

    const signal = await this.findArtistBandSignal(id);

    const [followCount, actionCounts, tracks, events] = await Promise.all([
      this.prisma.follow.count({
        where: {
          entityType: {
            in: ['artist', 'artistBand', 'band'],
          },
          entityId: artistBand.id,
        },
      }),
      signal
        ? this.prisma.signalAction.groupBy({
            by: ['type'],
            where: {
              signalId: signal.id,
            },
            _count: {
              type: true,
            },
          })
        : Promise.resolve([]),
      this.prisma.track.findMany({
        where: {
          status: 'ready',
          ...(artistBand.homeSceneId ? { communityId: artistBand.homeSceneId } : {}),
          OR: [
            {
              artistBandId: artistBand.id,
            },
            {
              artistBandId: null,
              artist: {
                equals: artistBand.name,
                mode: 'insensitive',
              },
            },
            ...(memberUserIds.length > 0
              ? [
                  {
                    artistBandId: null,
                    uploadedById: {
                      in: memberUserIds,
                    },
                  },
                ]
              : []),
          ],
        },
        select: {
          id: true,
          artistBandId: true,
          title: true,
          artist: true,
          album: true,
          duration: true,
          fileUrl: true,
          coverArt: true,
          playCount: true,
          likeCount: true,
          status: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'desc' }, { playCount: 'desc' }, { id: 'asc' }],
        take: 24,
      }),
      this.prisma.event.findMany({
        where: {
          ...(artistBand.homeSceneId ? { communityId: artistBand.homeSceneId } : {}),
          OR: [
            {
              artistBandId: artistBand.id,
            },
            {
              artistBandId: null,
              createdById: {
                in: memberUserIds.length > 0 ? memberUserIds : [artistBand.createdById],
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          startDate: true,
          endDate: true,
          locationName: true,
          address: true,
          attendeeCount: true,
          artistBandId: true,
          createdAt: true,
        },
        orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }],
        take: 12,
      }),
    ]);

    const counts = { add: 0, blast: 0, support: 0 };
    for (const row of actionCounts) {
      const key = row.type.trim().toUpperCase();
      if (key === 'ADD') counts.add = row._count.type;
      if (key === 'BLAST') counts.blast = row._count.type;
      if (key === 'SUPPORT') counts.support = row._count.type;
    }

    return {
      id: artistBand.id,
      name: artistBand.name,
      slug: artistBand.slug,
      entityType: artistBand.entityType,
      registrarEntryRef: artistBand.registrarEntryRef,
      createdAt: artistBand.createdAt.toISOString(),
      updatedAt: artistBand.updatedAt.toISOString(),
      bio: artistBand.createdBy.bio ?? null,
      avatar: artistBand.createdBy.avatar ?? null,
      coverImage: artistBand.createdBy.coverImage ?? null,
      createdBy: {
        id: artistBand.createdBy.id,
        username: artistBand.createdBy.username,
        displayName: artistBand.createdBy.displayName,
        avatar: artistBand.createdBy.avatar ?? null,
      },
      homeScene: artistBand.homeScene
        ? {
            ...artistBand.homeScene,
          }
        : null,
      members: artistBand.members.map((member) => ({
        userId: member.userId,
        role: member.role,
        createdAt: member.createdAt.toISOString(),
        user: {
          id: member.user.id,
          username: member.user.username,
          displayName: member.user.displayName,
          avatar: member.user.avatar ?? null,
        },
      })),
      memberCount: artistBand.members.length,
      followCount,
      actionCounts: counts,
      tracks: tracks.map((track) => ({
        id: track.id,
        artistBandId: track.artistBandId ?? null,
        title: track.title,
        artist: track.artist,
        album: track.album ?? null,
        duration: track.duration,
        fileUrl: track.fileUrl,
        coverArt: track.coverArt ?? null,
        playCount: track.playCount,
        likeCount: track.likeCount,
        status: track.status,
        createdAt: track.createdAt.toISOString(),
      })),
      events: events.map((event) => ({
        id: event.id,
        artistBandId: event.artistBandId ?? null,
        title: event.title,
        description: event.description ?? null,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        locationName: event.locationName,
        address: event.address,
        attendeeCount: event.attendeeCount,
        createdAt: event.createdAt.toISOString(),
      })),
    };
  }

  async addArtistBand(userId: string, artistBandId: string) {
    await this.getArtistBandOrThrow(artistBandId);
    const signalId = await this.getOrCreateArtistBandSignalId(artistBandId);

    const action = await this.prisma.signalAction.upsert({
      where: {
        userId_signalId_type: {
          userId,
          signalId,
          type: 'ADD',
        },
      },
      update: {},
      create: {
        userId,
        signalId,
        type: 'ADD',
      },
    });

    return { signalId, action };
  }

  async blastArtistBand(userId: string, artistBandId: string) {
    await this.getArtistBandOrThrow(artistBandId);
    const signalId = await this.getOrCreateArtistBandSignalId(artistBandId);

    const action = await this.prisma.signalAction.upsert({
      where: {
        userId_signalId_type: {
          userId,
          signalId,
          type: 'BLAST',
        },
      },
      update: {},
      create: {
        userId,
        signalId,
        type: 'BLAST',
      },
    });

    return { signalId, action };
  }

  async supportArtistBand(userId: string, artistBandId: string) {
    await this.getArtistBandOrThrow(artistBandId);
    const signalId = await this.getOrCreateArtistBandSignalId(artistBandId);

    const action = await this.prisma.signalAction.upsert({
      where: {
        userId_signalId_type: {
          userId,
          signalId,
          type: 'SUPPORT',
        },
      },
      update: {},
      create: {
        userId,
        signalId,
        type: 'SUPPORT',
      },
    });

    return { signalId, action };
  }

  async findByUserId(userId: string) {
    const artistBands = await this.prisma.artistBand.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        entityType: true,
        registrarEntryRef: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return artistBands;
  }
}
