import { SignalsService } from '../src/signals/signals.service';

describe('SignalsService', () => {
  const mockPrisma = {
    signalAction: {
      upsert: jest.fn(),
    },
    follow: {
      upsert: jest.fn(),
    },
    signal: {
      findUnique: jest.fn(),
    },
    collection: {
      upsert: jest.fn(),
    },
    collectionItem: {
      upsert: jest.fn(),
    },
  };

  let service: SignalsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SignalsService(mockPrisma as any);
  });

  it('recommendSignal upserts the RECOMMEND action type', async () => {
    mockPrisma.signalAction.upsert.mockResolvedValue({ id: 'action-1', type: 'RECOMMEND' });

    const result = await service.recommendSignal('user-1', 'signal-1');

    expect(result).toEqual({ id: 'action-1', type: 'RECOMMEND' });
    expect(mockPrisma.signalAction.upsert).toHaveBeenCalledWith({
      where: { userId_signalId_type: { userId: 'user-1', signalId: 'signal-1', type: 'RECOMMEND' } },
      update: {},
      create: { userId: 'user-1', signalId: 'signal-1', type: 'RECOMMEND' },
    });
  });
});
