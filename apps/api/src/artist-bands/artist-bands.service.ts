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

  async findProfile(id: string, viewerUserId?: string) {
    const artistBand = await this.getArtistBandOrThrow(id);
    const memberUserIds = artistBand.members.map((member) => member.userId);
    const signalAuthorIds = Array.from(new Set([artistBand.createdById, ...memberUserIds]));

    const [followCount, tracks, events, signals] = await Promise.all([
      this.prisma.follow.count({
        where: {
          entityType: {
            in: ['artist', 'artistBand', 'band'],
          },
          entityId: artistBand.id,
        },
      }),
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
      this.prisma.signal.findMany({
        where: {
          type: 'single',
          ...(artistBand.homeSceneId ? { communityId: artistBand.homeSceneId } : {}),
          ...(signalAuthorIds.length > 0
            ? {
                createdById: {
                  in: signalAuthorIds,
                },
              }
            : {}),
        },
        select: {
          id: true,
          createdById: true,
          metadata: true,
        },
      }),
    ]);

    const signalIdByTrackKey = new Map<string, string>();
    for (const signal of signals) {
      const metadata = (signal.metadata as Record<string, unknown> | null) ?? null;
      const signalTitle = typeof metadata?.title === 'string' ? metadata.title : null;
      const metadataArtistBandId =
        typeof metadata?.artistBandId === 'string' ? metadata.artistBandId : null;

      if (!signalTitle) {
        continue;
      }

      if (metadataArtistBandId && metadataArtistBandId !== artistBand.id) {
        continue;
      }

      const key = `${signalTitle.toLowerCase()}::${metadataArtistBandId ?? artistBand.id}`;
      if (!signalIdByTrackKey.has(key)) {
        signalIdByTrackKey.set(key, signal.id);
      }
    }

    const trackSignalIds = tracks
      .map((track) => signalIdByTrackKey.get(`${track.title.toLowerCase()}::${track.artistBandId ?? artistBand.id}`) ?? null)
      .filter((signalId): signalId is string => Boolean(signalId));

    const [viewerCollections, viewerRecommendations] =
      viewerUserId && trackSignalIds.length > 0
        ? await Promise.all([
            this.prisma.collectionItem.findMany({
              where: {
                signalId: {
                  in: trackSignalIds,
                },
                collection: {
                  userId: viewerUserId,
                },
              },
              select: {
                signalId: true,
              },
            }),
            this.prisma.signalAction.findMany({
              where: {
                userId: viewerUserId,
                signalId: {
                  in: trackSignalIds,
                },
                type: 'RECOMMEND',
              },
              select: {
                signalId: true,
              },
            }),
          ])
        : [[], []];

    const viewerCollectedSignalIds = new Set(viewerCollections.map((item) => item.signalId));
    const viewerRecommendedSignalIds = new Set(viewerRecommendations.map((action) => action.signalId));

    return {
      id: artistBand.id,
      name: artistBand.name,
      slug: artistBand.slug,
      entityType: artistBand.entityType,
      registrarEntryRef: artistBand.registrarEntryRef,
      officialWebsiteUrl: artistBand.officialWebsiteUrl ?? null,
      merchUrl: artistBand.merchUrl ?? null,
      musicUrl: artistBand.musicUrl ?? null,
      donationUrl: artistBand.donationUrl ?? null,
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
      tracks: tracks.map((track) => ({
        signalId:
          signalIdByTrackKey.get(`${track.title.toLowerCase()}::${track.artistBandId ?? artistBand.id}`) ??
          null,
        viewerHasCollected: Boolean(
          viewerCollectedSignalIds.has(
            signalIdByTrackKey.get(`${track.title.toLowerCase()}::${track.artistBandId ?? artistBand.id}`) ?? '',
          ),
        ),
        viewerHasRecommended: Boolean(
          viewerRecommendedSignalIds.has(
            signalIdByTrackKey.get(`${track.title.toLowerCase()}::${track.artistBandId ?? artistBand.id}`) ?? '',
          ),
        ),
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
