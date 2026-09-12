import { SectRegistrarController } from '../src/registrar/sect-registrar.controller';

describe('SectRegistrarController', () => {
  const sceneId = '11111111-1111-1111-1111-111111111111';

  it('submits a named listener Sect request', async () => {
    const data = { id: 'request-1', payload: { sectName: 'Noise Art', sectSlug: 'noise-art' } };
    const service = { submitSectRequest: jest.fn().mockResolvedValue(data) } as any;
    const controller = new SectRegistrarController(service);

    await expect(
      controller.submitSectRequest(
        { sceneId, sectName: 'Noise Art' },
        { user: { userId: 'listener-1' } },
      ),
    ).resolves.toEqual({ success: true, data });
    expect(service.submitSectRequest).toHaveBeenCalledWith('listener-1', {
      sceneId,
      sectName: 'Noise Art',
    });
  });

  it('registers canonical Artist/Band membership through the authenticated actor', async () => {
    const data = { id: 'membership-1', sectId: 'sect-1', artistBandId: 'artist-band-1', created: true };
    const service = { registerArtistBandMembership: jest.fn().mockResolvedValue(data) } as any;
    const controller = new SectRegistrarController(service);

    await expect(
      controller.registerArtistBandMembership(
        'sect-1',
        { artistBandId: '11111111-1111-1111-1111-111111111111' },
        { user: { userId: 'owner-1' } },
      ),
    ).resolves.toEqual({ success: true, data });
    expect(service.registerArtistBandMembership).toHaveBeenCalledWith('owner-1', 'sect-1', {
      artistBandId: '11111111-1111-1111-1111-111111111111',
    });
  });

  it('lists and reads submitter-owned requests', async () => {
    const list = { total: 0, countsByStatus: {}, entries: [] };
    const detail = { id: 'request-1' };
    const service = {
      listSectRequests: jest.fn().mockResolvedValue(list),
      getSectRequest: jest.fn().mockResolvedValue(detail),
    } as any;
    const controller = new SectRegistrarController(service);

    await expect(controller.listMySectRequests({ user: { userId: 'listener-1' } })).resolves.toEqual({
      success: true,
      data: list,
    });
    await expect(
      controller.getMySectRequest('request-1', { user: { userId: 'listener-1' } }),
    ).resolves.toEqual({ success: true, data: detail });
  });

  it('preserves service errors for the HTTP exception layer', async () => {
    const failure = new Error('request rejected');
    const service = { submitSectRequest: jest.fn().mockRejectedValue(failure) } as any;
    const controller = new SectRegistrarController(service);

    await expect(
      controller.submitSectRequest(
        { sceneId, sectName: 'Noise Art' },
        { user: { userId: 'listener-1' } },
      ),
    ).rejects.toBe(failure);
  });
});
