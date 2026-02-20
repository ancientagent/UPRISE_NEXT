import { NotFoundException } from '@nestjs/common';
import { ArtistBandsService } from '../src/artist-bands/artist-bands.service';

describe('ArtistBandsService', () => {
  const mockPrisma = {
    artistBand: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  let service: ArtistBandsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ArtistBandsService(mockPrisma as any);
  });

  it('throws NotFoundException when artist/band entity is missing', async () => {
    mockPrisma.artistBand.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toThrow(NotFoundException);
  });

  it('returns mapped artist/band entity with membership details', async () => {
    mockPrisma.artistBand.findUnique.mockResolvedValue({
      id: 'ab-1',
      name: 'The Static Hearts',
      slug: 'the-static-hearts',
      entityType: 'band',
      registrarEntryRef: 'reg-101',
      createdAt: new Date('2026-02-20T00:00:00.000Z'),
      updatedAt: new Date('2026-02-20T00:00:00.000Z'),
      createdBy: {
        id: 'u-1',
        username: 'owner',
        displayName: 'Owner',
      },
      homeScene: {
        id: 'scene-1',
        name: 'Austin Punk',
        slug: 'austin-punk',
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'punk',
        tier: 'city',
      },
      members: [
        {
          userId: 'u-1',
          role: 'owner',
          createdAt: new Date('2026-02-20T00:00:00.000Z'),
          user: {
            id: 'u-1',
            username: 'owner',
            displayName: 'Owner',
          },
        },
        {
          userId: 'u-2',
          role: 'manager',
          createdAt: new Date('2026-02-20T00:00:00.000Z'),
          user: {
            id: 'u-2',
            username: 'mgr',
            displayName: 'Manager',
          },
        },
      ],
    });

    const result = await service.findOne('ab-1');

    expect(result.id).toBe('ab-1');
    expect(result.entityType).toBe('band');
    expect(result.registrarEntryRef).toBe('reg-101');
    expect(result.memberCount).toBe(2);
    expect(result.members[0]).toEqual(
      expect.objectContaining({
        userId: 'u-1',
        role: 'owner',
      }),
    );
  });

  it('lists artist/band entities managed by a user', async () => {
    mockPrisma.artistBand.findMany.mockResolvedValue([
      {
        id: 'ab-1',
        name: 'Solo Signal',
        slug: 'solo-signal',
        entityType: 'artist',
        registrarEntryRef: null,
        createdAt: new Date('2026-02-20T00:00:00.000Z'),
        updatedAt: new Date('2026-02-20T00:00:00.000Z'),
      },
    ]);

    const result = await service.findByUserId('u-1');

    expect(mockPrisma.artistBand.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          members: {
            some: {
              userId: 'u-1',
            },
          },
        },
      }),
    );
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('solo-signal');
  });
});
