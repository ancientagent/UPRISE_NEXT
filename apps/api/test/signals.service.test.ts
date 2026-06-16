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
      findFirst: jest.fn(),
    },
  };

  let service: SignalsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SignalsService(mockPrisma as any);
  });

  it('recommendSignal upserts the RECOMMEND action type', async () => {
    mockPrisma.collectionItem.findFirst.mockResolvedValue({ id: 'item-1' });
    mockPrisma.signalAction.upsert.mockResolvedValue({ id: 'action-1', type: 'RECOMMEND' });

    const result = await service.recommendSignal('user-1', 'signal-1');

    expect(result).toEqual({ id: 'action-1', type: 'RECOMMEND' });
    expect(mockPrisma.collectionItem.findFirst).toHaveBeenCalledWith({
      where: {
        signalId: 'signal-1',
        collection: {
          userId: 'user-1',
        },
      },
      select: {
        id: true,
      },
    });
    expect(mockPrisma.signalAction.upsert).toHaveBeenCalledWith({
      where: { userId_signalId_type: { userId: 'user-1', signalId: 'signal-1', type: 'RECOMMEND' } },
      update: {},
      create: { userId: 'user-1', signalId: 'signal-1', type: 'RECOMMEND' },
    });
  });

  it('rejects recommendation when the listener has not collected the signal', async () => {
    mockPrisma.collectionItem.findFirst.mockResolvedValue(null);

    await expect(service.recommendSignal('user-1', 'signal-1')).rejects.toThrow(
      'Collect this song before recommending it.',
    );

    expect(mockPrisma.signalAction.upsert).not.toHaveBeenCalled();
  });
});
