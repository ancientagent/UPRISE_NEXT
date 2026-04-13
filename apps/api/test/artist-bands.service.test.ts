import { NotFoundException } from '@nestjs/common';
import { ArtistBandsService } from '../src/artist-bands/artist-bands.service';

describe('ArtistBandsService', () => {
  const mockPrisma = {
    artistBand: { findUnique: jest.fn(), findMany: jest.fn() },
    signal: { findFirst: jest.fn(), create: jest.fn() },
    signalAction: { groupBy: jest.fn(), upsert: jest.fn() },
    follow: { count: jest.fn() },
    track: { findMany: jest.fn() },
    event: { findMany: jest.fn() },
  };

  let service: ArtistBandsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ArtistBandsService(mockPrisma as any);
  });

  it('throws when the artist/band does not exist', async () => {
    mockPrisma.artistBand.findUnique.mockResolvedValue(null);

    await expect(service.findProfile('missing-band')).rejects.toThrow(NotFoundException);
  });

  it('returns a profile with songs, events, and action counts', async () => {
    mockPrisma.artistBand.findUnique.mockResolvedValue({
      id: 'artist-1',
      name: 'Signal Static',
      slug: 'signal-static',
      entityType: 'band',
      registrarEntryRef: null,
      homeSceneId: 'scene-1',
      createdById: 'user-1',
      createdAt: new Date('2026-03-20T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T00:00:00.000Z'),
      createdBy: {
        id: 'user-1',
        username: 'signalstatic',
        displayName: 'Signal Static',
        bio: 'Local broadcast damage.',
        avatar: null,
        coverImage: null,
      },
      homeScene: {
        id: 'scene-1',
        name: 'Austin Punk',
        slug: 'austin-punk',
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'Punk',
        tier: 'city',
      },
      members: [
        {
          userId: 'user-1',
          role: 'owner',
          createdAt: new Date('2026-03-20T00:00:00.000Z'),
          user: {
            id: 'user-1',
            username: 'signalstatic',
            displayName: 'Signal Static',
            avatar: null,
          },
        },
      ],
    });
    mockPrisma.signal.findFirst.mockResolvedValue({ id: 'signal-artist-1' });
    mockPrisma.follow.count.mockResolvedValue(14);
    mockPrisma.signalAction.groupBy.mockResolvedValue([
      { type: 'ADD', _count: { type: 3 } },
      { type: 'BLAST', _count: { type: 5 } },
      { type: 'SUPPORT', _count: { type: 2 } },
    ]);
    mockPrisma.track.findMany.mockResolvedValue([
      {
        id: 'track-1',
        title: 'Broken Tower',
        artist: 'Signal Static',
        album: null,
        duration: 187,
        fileUrl: 'https://cdn.example.com/track-1.mp3',
        coverArt: null,
        playCount: 42,
        likeCount: 10,
        status: 'ready',
        createdAt: new Date('2026-03-20T00:00:00.000Z'),
      },
    ]);
    mockPrisma.event.findMany.mockResolvedValue([
      {
        id: 'event-1',
        title: 'Warehouse Set',
        description: 'All ages.',
        startDate: new Date('2026-04-01T01:00:00.000Z'),
        endDate: new Date('2026-04-01T03:00:00.000Z'),
        locationName: 'The Yard',
        address: '123 Red River',
        attendeeCount: 88,
        createdAt: new Date('2026-03-21T00:00:00.000Z'),
      },
    ]);

    const result = await service.findProfile('artist-1');

    expect(result.name).toBe('Signal Static');
    expect(result.followCount).toBe(14);
    expect(result.actionCounts).toEqual({ add: 3, blast: 5, support: 2 });
    expect(result.tracks).toHaveLength(1);
    expect(result.events).toHaveLength(1);
    expect(mockPrisma.track.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'ready',
          communityId: 'scene-1',
        }),
      }),
    );
  });

  it('keeps explicit source ownership ahead of legacy fallback on profile reads', async () => {
    mockPrisma.artistBand.findUnique.mockResolvedValue({
      id: 'artist-1',
      name: 'Signal Static',
      slug: 'signal-static',
      entityType: 'band',
      registrarEntryRef: null,
      homeSceneId: 'scene-1',
      createdById: 'user-1',
      createdAt: new Date('2026-03-20T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T00:00:00.000Z'),
      createdBy: {
        id: 'user-1',
        username: 'signalstatic',
        displayName: 'Signal Static',
        bio: null,
        avatar: null,
        coverImage: null,
      },
      homeScene: null,
      members: [
        {
          userId: 'user-2',
          role: 'member',
          createdAt: new Date('2026-03-20T00:00:00.000Z'),
          user: {
            id: 'user-2',
            username: 'signalmate',
            displayName: 'Signal Mate',
            avatar: null,
          },
        },
      ],
    });
    mockPrisma.signal.findFirst.mockResolvedValue(null);
    mockPrisma.follow.count.mockResolvedValue(0);
    mockPrisma.signalAction.groupBy.mockResolvedValue([]);
    mockPrisma.track.findMany.mockResolvedValue([]);
    mockPrisma.event.findMany.mockResolvedValue([]);

    await service.findProfile('artist-1');

    expect(mockPrisma.track.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: 'ready',
          communityId: 'scene-1',
          OR: [
            {
              artistBandId: 'artist-1',
            },
            {
              artistBandId: null,
              artist: {
                equals: 'Signal Static',
                mode: 'insensitive',
              },
            },
            {
              artistBandId: null,
              uploadedById: {
                in: ['user-2'],
              },
            },
          ],
        },
      }),
    );
    expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          communityId: 'scene-1',
          OR: [
            {
              artistBandId: 'artist-1',
            },
            {
              artistBandId: null,
              createdById: {
                in: ['user-2'],
              },
            },
          ],
        },
      }),
    );
  });

  it('creates a stable artist signal before recording blast actions', async () => {
    mockPrisma.artistBand.findUnique.mockResolvedValue({
      id: 'artist-1',
      name: 'Signal Static',
      slug: 'signal-static',
      entityType: 'band',
      registrarEntryRef: null,
      homeSceneId: 'scene-1',
      createdById: 'user-1',
      createdAt: new Date('2026-03-20T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T00:00:00.000Z'),
      createdBy: {
        id: 'user-1',
        username: 'signalstatic',
        displayName: 'Signal Static',
        bio: null,
        avatar: null,
        coverImage: null,
      },
      homeScene: null,
      members: [],
    });
    mockPrisma.signal.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'signal-artist-1' });
    mockPrisma.signal.create.mockResolvedValue({ id: 'signal-artist-1' });
    mockPrisma.signalAction.upsert.mockResolvedValue({ id: 'blast-action-1' });

    const result = await service.blastArtistBand('user-2', 'artist-1');

    expect(result.signalId).toBe('signal-artist-1');
    expect(mockPrisma.signal.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'artist_band',
          metadata: expect.objectContaining({
            artistBandId: 'artist-1',
          }),
        }),
      }),
    );
    expect(mockPrisma.signalAction.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          userId: 'user-2',
          signalId: 'signal-artist-1',
          type: 'BLAST',
        }),
      }),
    );
  });
});
