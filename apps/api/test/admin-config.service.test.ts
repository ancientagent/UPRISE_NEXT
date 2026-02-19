import { AdminConfigService } from '../src/admin-config/admin-config.service';

const mockPrisma = {
  fairPlayConfig: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
  },
};

describe('AdminConfigService', () => {
  let service: AdminConfigService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AdminConfigService(mockPrisma as any);
  });

  it('returns current global fair-play config', async () => {
    mockPrisma.fairPlayConfig.findUnique.mockResolvedValue({
      scope: 'global',
      recurrenceReorderHours: 48,
    });

    const result = await service.getFairPlayConfig();

    expect(result.success).toBe(true);
    expect(result.data?.scope).toBe('global');
    expect(mockPrisma.fairPlayConfig.findUnique).toHaveBeenCalledWith({
      where: { scope: 'global' },
    });
  });

  it('upserts global fair-play config', async () => {
    mockPrisma.fairPlayConfig.upsert.mockResolvedValue({
      scope: 'global',
      recurrenceRollingWindowDays: 14,
    });

    const result = await service.updateFairPlayConfig({
      recurrenceRollingWindowDays: 14,
    });

    expect(result.success).toBe(true);
    expect(result.data?.recurrenceRollingWindowDays).toBe(14);
    expect(mockPrisma.fairPlayConfig.upsert).toHaveBeenCalledWith({
      where: { scope: 'global' },
      update: { recurrenceRollingWindowDays: 14 },
      create: { scope: 'global', recurrenceRollingWindowDays: 14 },
    });
  });
});
