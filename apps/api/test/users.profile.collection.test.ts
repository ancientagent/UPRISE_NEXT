import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../src/users/users.service';

describe('UsersService.getProfileWithCollection', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    artistBandMember: {
      count: jest.fn(),
    },
    collection: {
      findMany: jest.fn(),
    },
  };

  let service: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsersService(mockPrisma as any);
  });

  it('throws NotFoundException when target user does not exist', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(service.getProfileWithCollection('viewer', 'missing')).rejects.toThrow(NotFoundException);
  });

  it('hides collection shelves for non-owner when display is disabled', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'target',
      username: 'target',
      displayName: 'Target',
      bio: null,
      avatar: null,
      coverImage: null,
      isArtist: false,
      city: 'Austin',
      country: 'US',
      collectionDisplayEnabled: false,
      createdAt: new Date(),
    });
    mockPrisma.artistBandMember.count.mockResolvedValue(0);

    const result = await service.getProfileWithCollection('viewer', 'target');

    expect(result.canViewCollection).toBe(false);
    expect(result.collectionShelves).toEqual([]);
    expect(result.user.hasArtistBand).toBe(false);
    expect(mockPrisma.collection.findMany).not.toHaveBeenCalled();
  });

  it('returns fixed shelves for owner and maps shelf items', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'target',
      username: 'target',
      displayName: 'Target',
      bio: null,
      avatar: null,
      coverImage: null,
      isArtist: false,
      city: 'Austin',
      country: 'US',
      collectionDisplayEnabled: false,
      createdAt: new Date(),
    });
    mockPrisma.artistBandMember.count.mockResolvedValue(1);

    mockPrisma.collection.findMany.mockResolvedValue([
      {
        name: 'singles',
        items: [
          {
            createdAt: new Date('2026-02-19T10:00:00.000Z'),
            signal: {
              id: 'signal-1',
              type: 'single',
              metadata: null,
              createdAt: new Date('2026-02-19T10:00:00.000Z'),
            },
          },
        ],
      },
      {
        name: 'uprises',
        items: [],
      },
    ]);

    const result = await service.getProfileWithCollection('target', 'target');

    expect(result.canViewCollection).toBe(true);
    expect(result.user.hasArtistBand).toBe(true);
    expect(result.collectionShelves).toHaveLength(7);
    const singles = result.collectionShelves.find((s) => s.shelf === 'singles');
    expect(singles?.itemCount).toBe(1);
    expect(singles?.items[0].signalId).toBe('signal-1');
  });
});
