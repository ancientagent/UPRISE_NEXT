import { NotFoundException } from '@nestjs/common';
import { CommunitiesService } from '../src/communities/communities.service';

describe('CommunitiesService.getPromotions', () => {
  const mockPrisma = {
    community: { findUnique: jest.fn() },
    signal: { findMany: jest.fn() },
  };

  let service: CommunitiesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CommunitiesService(mockPrisma as any);
  });

  it('throws NotFoundException when community does not exist', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);
    await expect(service.getPromotions('missing', { limit: 20 })).rejects.toThrow(NotFoundException);
  });

  it('returns deterministic promotions payload from scene signals', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({ id: 'community-1' });
    mockPrisma.signal.findMany.mockResolvedValue([
      {
        id: 'promo-1',
        type: 'PROMOTION',
        metadata: { title: 'Local Merch Discount', callToAction: 'Redeem in-store' },
        createdAt: new Date('2026-02-21T10:00:00.000Z'),
        createdBy: { id: 'u1', username: 'biz1', displayName: 'Business 1', avatar: null },
      },
    ]);

    const result = await service.getPromotions('community-1', { limit: 10 });

    expect(result.limit).toBe(10);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].type).toBe('PROMOTION');
    expect(result.items[0].metadata?.title).toBe('Local Merch Discount');
    expect(mockPrisma.signal.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        where: expect.objectContaining({
          communityId: 'community-1',
          type: { in: ['PROMOTION', 'OFFER'] },
        }),
      }),
    );
  });
});
