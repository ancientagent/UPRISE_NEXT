import { OnboardingService } from '../src/onboarding/onboarding.service';

describe('OnboardingService music community requests', () => {
  it('stores missing music-community intake without creating a live Community', async () => {
    const prisma = {
      musicCommunityRequest: {
        upsert: jest.fn().mockResolvedValue({
          id: 'request-1',
          requestedName: 'Hardcore',
          city: 'Austin',
          state: 'TX',
          status: 'submitted',
          createdAt: new Date('2026-06-16T00:00:00.000Z'),
          updatedAt: new Date('2026-06-16T00:00:00.000Z'),
        }),
        findMany: jest
          .fn()
          .mockResolvedValueOnce([{ userId: 'user-1' }, { userId: 'user-2' }])
          .mockResolvedValueOnce([
            { cityNormalized: 'austin', stateNormalized: 'tx' },
            { cityNormalized: 'houston', stateNormalized: 'tx' },
          ]),
      },
      community: {
        create: jest.fn(),
      },
    };
    const service = new OnboardingService(prisma as any);

    const result = await service.requestMusicCommunity('user-1', {
      requestedName: '  Hardcore  ',
      city: ' Austin ',
      state: ' TX ',
    });

    expect(prisma.musicCommunityRequest.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_requestedNameNormalized_cityNormalized_stateNormalized: {
            userId: 'user-1',
            requestedNameNormalized: 'hardcore',
            cityNormalized: 'austin',
            stateNormalized: 'tx',
          },
        },
        create: expect.objectContaining({
          userId: 'user-1',
          requestedName: 'Hardcore',
          requestedNameNormalized: 'hardcore',
          city: 'Austin',
          cityNormalized: 'austin',
          state: 'TX',
          stateNormalized: 'tx',
          status: 'submitted',
        }),
      })
    );
    expect(prisma.community.create).not.toHaveBeenCalled();
    expect(result.reviewSignals).toEqual({
      distinctRequesterCount: 2,
      distinctCityCount: 2,
    });
  });
});
