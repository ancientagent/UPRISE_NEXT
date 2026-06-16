import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EventsService } from '../src/events/events.service';

describe('EventsService.createFromPrintShop', () => {
  const mockPrisma = {
    community: { findUnique: jest.fn() },
    userCapabilityGrant: { findFirst: jest.fn() },
    artistBand: { findFirst: jest.fn() },
    artistBandMember: { findFirst: jest.fn() },
    event: { create: jest.fn() },
  };

  let service: EventsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EventsService(mockPrisma as any);
  });

  const baseDto = {
    title: 'Warehouse Show',
    description: 'All-ages punk night.',
    startDate: '2026-04-12T19:00:00.000Z',
    endDate: '2026-04-12T23:00:00.000Z',
    locationName: 'Southside Warehouse',
    address: '123 Main St, Austin, TX',
    latitude: 30.2672,
    longitude: -97.7431,
    communityId: '00000000-0000-0000-0000-000000000001',
  };

  it('rejects when the community does not exist', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue({ id: 'grant-1' });
    mockPrisma.artistBand.findFirst.mockResolvedValue(null);
    mockPrisma.artistBandMember.findFirst.mockResolvedValue(null);

    await expect(service.createFromPrintShop('user-1', baseDto as any)).rejects.toThrow(NotFoundException);
  });

  it('rejects when the user has neither promoter capability nor artist ownership', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({ id: baseDto.communityId });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue(null);
    mockPrisma.artistBand.findFirst.mockResolvedValue(null);
    mockPrisma.artistBandMember.findFirst.mockResolvedValue(null);

    await expect(service.createFromPrintShop('user-1', baseDto as any)).rejects.toThrow(ForbiddenException);
  });

  it('rejects invalid dates', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({ id: baseDto.communityId });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue({ id: 'grant-1' });
    mockPrisma.artistBand.findFirst.mockResolvedValue(null);
    mockPrisma.artistBandMember.findFirst.mockResolvedValue(null);

    await expect(
      service.createFromPrintShop('user-1', {
        ...baseDto,
        startDate: 'nope',
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects end date before start date', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({ id: baseDto.communityId });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue({ id: 'grant-1' });
    mockPrisma.artistBand.findFirst.mockResolvedValue(null);
    mockPrisma.artistBandMember.findFirst.mockResolvedValue(null);

    await expect(
      service.createFromPrintShop('user-1', {
        ...baseDto,
        startDate: '2026-04-12T23:00:00.000Z',
        endDate: '2026-04-12T19:00:00.000Z',
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('creates an event for a promoter-capable user', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({ id: baseDto.communityId });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue({ id: 'grant-1' });
    mockPrisma.artistBand.findFirst.mockResolvedValue(null);
    mockPrisma.artistBandMember.findFirst.mockResolvedValue(null);
    mockPrisma.event.create.mockResolvedValue({
      id: 'event-1',
      title: 'Warehouse Show',
      description: 'All-ages punk night.',
      coverImage: null,
      startDate: new Date(baseDto.startDate),
      endDate: new Date(baseDto.endDate),
      locationName: baseDto.locationName,
      address: baseDto.address,
      latitude: baseDto.latitude,
      longitude: baseDto.longitude,
      communityId: baseDto.communityId,
      createdById: 'user-1',
      artistBandId: null,
      attendeeCount: 0,
      maxAttendees: null,
      createdAt: new Date('2026-04-10T12:00:00.000Z'),
      updatedAt: new Date('2026-04-10T12:00:00.000Z'),
    });

    const result = await service.createFromPrintShop('user-1', baseDto as any);

    expect(mockPrisma.event.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Warehouse Show',
          communityId: baseDto.communityId,
          createdById: 'user-1',
          artistBandId: null,
        }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'event-1',
        title: 'Warehouse Show',
        communityId: baseDto.communityId,
        createdById: 'user-1',
        artistBandId: null,
      }),
    );
  });

  it('creates an event for an artist-linked user without promoter capability', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({ id: baseDto.communityId });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue(null);
    mockPrisma.artistBand.findFirst.mockResolvedValue(null);
    mockPrisma.artistBandMember.findFirst.mockResolvedValue({ artistBandId: 'band-1' });
    mockPrisma.event.create.mockResolvedValue({
      id: 'event-2',
      title: 'Warehouse Show',
      description: 'All-ages punk night.',
      coverImage: null,
      startDate: new Date(baseDto.startDate),
      endDate: new Date(baseDto.endDate),
      locationName: baseDto.locationName,
      address: baseDto.address,
      latitude: baseDto.latitude,
      longitude: baseDto.longitude,
      communityId: baseDto.communityId,
      createdById: 'user-1',
      artistBandId: null,
      attendeeCount: 0,
      maxAttendees: 150,
      createdAt: new Date('2026-04-10T12:00:00.000Z'),
      updatedAt: new Date('2026-04-10T12:00:00.000Z'),
    });

    const result = await service.createFromPrintShop('user-1', {
      ...baseDto,
      maxAttendees: 150,
    } as any);

    expect(result.maxAttendees).toBe(150);
    expect(result.artistBandId).toBeNull();
  });

  it('creates an event linked to the managed artist band when artistBandId is supplied', async () => {
    mockPrisma.artistBand.findFirst.mockResolvedValue({
      id: 'band-1',
      name: 'Youngblood QA Source',
      homeSceneId: baseDto.communityId,
    });
    mockPrisma.community.findUnique.mockResolvedValue({ id: baseDto.communityId });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue(null);
    mockPrisma.artistBandMember.findFirst.mockResolvedValue({ artistBandId: 'band-1' });
    mockPrisma.event.create.mockResolvedValue({
      id: 'event-3',
      title: 'Warehouse Show',
      description: 'All-ages punk night.',
      coverImage: null,
      startDate: new Date(baseDto.startDate),
      endDate: new Date(baseDto.endDate),
      locationName: baseDto.locationName,
      address: baseDto.address,
      latitude: baseDto.latitude,
      longitude: baseDto.longitude,
      communityId: baseDto.communityId,
      createdById: 'user-1',
      artistBandId: 'band-1',
      attendeeCount: 0,
      maxAttendees: null,
      createdAt: new Date('2026-04-10T12:00:00.000Z'),
      updatedAt: new Date('2026-04-10T12:00:00.000Z'),
    });

    const result = await service.createFromPrintShop('user-1', {
      ...baseDto,
      artistBandId: 'band-1',
    } as any);

    expect(mockPrisma.event.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          artistBandId: 'band-1',
          createdById: 'user-1',
        }),
      }),
    );
    expect(result.artistBandId).toBe('band-1');
  });

  it('rejects artistBandId when the signed-in user does not manage that source', async () => {
    mockPrisma.artistBand.findFirst.mockResolvedValue(null);

    await expect(
      service.createFromPrintShop('user-1', {
        ...baseDto,
        artistBandId: 'band-1',
      } as any),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects artistBandId when the managed source home scene does not match the requested community', async () => {
    mockPrisma.artistBand.findFirst.mockResolvedValue({
      id: 'band-1',
      name: 'Youngblood QA Source',
      homeSceneId: '00000000-0000-0000-0000-000000000099',
    });

    await expect(
      service.createFromPrintShop('user-1', {
        ...baseDto,
        artistBandId: 'band-1',
      } as any),
    ).rejects.toThrow(BadRequestException);
  });
});
