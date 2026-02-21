import { RegistrarController } from '../src/registrar/registrar.controller';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('RegistrarController', () => {
  it('submits promoter registration through registrar service', async () => {
    const registrarService = {
      submitPromoterRegistration: jest.fn().mockResolvedValue({
        id: 'reg-promoter-1',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        createdById: 'u-1',
        payload: { productionName: 'Southside Signal Co.' },
      }),
    } as any;

    const controller = new RegistrarController(registrarService);

    const response = await controller.submitPromoterRegistration(
      {
        sceneId: '11111111-1111-1111-1111-111111111111',
        productionName: 'Southside Signal Co.',
      },
      { user: { userId: 'u-1' } },
    );

    expect(registrarService.submitPromoterRegistration).toHaveBeenCalledWith('u-1', {
      sceneId: '11111111-1111-1111-1111-111111111111',
      productionName: 'Southside Signal Co.',
    });
    expect(response).toEqual({
      success: true,
      data: {
        id: 'reg-promoter-1',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        createdById: 'u-1',
        payload: { productionName: 'Southside Signal Co.' },
      },
    });
  });

  it('propagates promoter submit errors from registrar service', async () => {
    const registrarService = {
      submitPromoterRegistration: jest.fn().mockRejectedValue(new ForbiddenException('No access')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(
      controller.submitPromoterRegistration(
        {
          sceneId: '11111111-1111-1111-1111-111111111111',
          productionName: 'Southside Signal Co.',
        },
        { user: { userId: 'u-1' } },
      ),
    ).rejects.toThrow(ForbiddenException);
    expect(registrarService.submitPromoterRegistration).toHaveBeenCalledWith('u-1', {
      sceneId: '11111111-1111-1111-1111-111111111111',
      productionName: 'Southside Signal Co.',
    });
  });

  it('lists submitter promoter registrations through registrar service', async () => {
    const registrarService = {
      listPromoterRegistrations: jest.fn().mockResolvedValue({
        total: 1,
        countsByStatus: { submitted: 1 },
        entries: [
          {
            id: 'reg-promoter-1',
            type: 'promoter_registration',
            status: 'submitted',
            sceneId: '11111111-1111-1111-1111-111111111111',
            payload: { productionName: 'Southside Signal Co.' },
          },
        ],
      }),
    } as any;

    const controller = new RegistrarController(registrarService);

    const response = await controller.listMyPromoterRegistrations({ user: { userId: 'u-1' } });

    expect(registrarService.listPromoterRegistrations).toHaveBeenCalledWith('u-1');
    expect(response).toEqual({
      success: true,
      data: {
        total: 1,
        countsByStatus: { submitted: 1 },
        entries: [
          {
            id: 'reg-promoter-1',
            type: 'promoter_registration',
            status: 'submitted',
            sceneId: '11111111-1111-1111-1111-111111111111',
            payload: { productionName: 'Southside Signal Co.' },
          },
        ],
      },
    });
  });

  it('reads submitter promoter registration detail through registrar service', async () => {
    const registrarService = {
      getPromoterRegistration: jest.fn().mockResolvedValue({
        id: 'reg-promoter-1',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        payload: { productionName: 'Southside Signal Co.' },
      }),
    } as any;

    const controller = new RegistrarController(registrarService);

    const response = await controller.getMyPromoterRegistration('reg-promoter-1', {
      user: { userId: 'u-1' },
    });

    expect(registrarService.getPromoterRegistration).toHaveBeenCalledWith('u-1', 'reg-promoter-1');
    expect(response).toEqual({
      success: true,
      data: {
        id: 'reg-promoter-1',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        payload: { productionName: 'Southside Signal Co.' },
      },
    });
  });

  it('propagates promoter list read errors from registrar service', async () => {
    const registrarService = {
      listPromoterRegistrations: jest.fn().mockRejectedValue(new ForbiddenException('No access')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(controller.listMyPromoterRegistrations({ user: { userId: 'u-1' } })).rejects.toThrow(
      ForbiddenException,
    );
    expect(registrarService.listPromoterRegistrations).toHaveBeenCalledWith('u-1');
  });

  it('propagates promoter detail read errors from registrar service', async () => {
    const registrarService = {
      getPromoterRegistration: jest.fn().mockRejectedValue(new NotFoundException('Registrar entry not found')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(
      controller.getMyPromoterRegistration('missing-entry', { user: { userId: 'u-1' } }),
    ).rejects.toThrow(NotFoundException);
    expect(registrarService.getPromoterRegistration).toHaveBeenCalledWith('u-1', 'missing-entry');
  });

  it('lists submitter artist/band registrations through registrar service', async () => {
    const registrarService = {
      listArtistBandRegistrations: jest.fn().mockResolvedValue({
        total: 1,
        entries: [
          {
            id: 'reg-artist-1',
            type: 'artist_band_registration',
            status: 'submitted',
            sceneId: '11111111-1111-1111-1111-111111111111',
            payload: { name: 'Static Signal', slug: 'static-signal', entityType: 'band' },
          },
        ],
      }),
    } as any;
    const controller = new RegistrarController(registrarService);

    const response = await controller.listMyArtistBandRegistrations({ user: { userId: 'u-1' } });

    expect(registrarService.listArtistBandRegistrations).toHaveBeenCalledWith('u-1');
    expect(response).toEqual({
      success: true,
      data: {
        total: 1,
        entries: [
          {
            id: 'reg-artist-1',
            type: 'artist_band_registration',
            status: 'submitted',
            sceneId: '11111111-1111-1111-1111-111111111111',
            payload: { name: 'Static Signal', slug: 'static-signal', entityType: 'band' },
          },
        ],
      },
    });
  });

  it('propagates artist/band list read errors from registrar service', async () => {
    const registrarService = {
      listArtistBandRegistrations: jest.fn().mockRejectedValue(new ForbiddenException('No access')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(controller.listMyArtistBandRegistrations({ user: { userId: 'u-1' } })).rejects.toThrow(
      ForbiddenException,
    );
    expect(registrarService.listArtistBandRegistrations).toHaveBeenCalledWith('u-1');
  });

  it('submits artist/band registration through registrar service', async () => {
    const registrarService = {
      submitArtistBandRegistration: jest.fn().mockResolvedValue({
        id: 'reg-artist-2',
        type: 'artist_band_registration',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        createdById: 'u-1',
        payload: { name: 'Static Signal', slug: 'static-signal', entityType: 'band' },
      }),
    } as any;
    const controller = new RegistrarController(registrarService);

    const dto = {
      sceneId: '11111111-1111-1111-1111-111111111111',
      name: 'Static Signal',
      slug: 'static-signal',
      entityType: 'band' as const,
      members: [
        { name: 'Alex Volt', email: 'alex@example.com', city: 'Austin', instrument: 'Guitar' },
        { name: 'Sam Pulse', email: 'sam@example.com', city: 'Austin', instrument: 'Drums' },
      ],
    };

    const response = await controller.submitArtistBandRegistration(dto, { user: { userId: 'u-1' } });

    expect(registrarService.submitArtistBandRegistration).toHaveBeenCalledWith('u-1', dto);
    expect(response).toEqual({
      success: true,
      data: {
        id: 'reg-artist-2',
        type: 'artist_band_registration',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        createdById: 'u-1',
        payload: { name: 'Static Signal', slug: 'static-signal', entityType: 'band' },
      },
    });
  });

  it('propagates artist/band submit errors from registrar service', async () => {
    const registrarService = {
      submitArtistBandRegistration: jest.fn().mockRejectedValue(new ForbiddenException('GPS required')),
    } as any;
    const controller = new RegistrarController(registrarService);

    const dto = {
      sceneId: '11111111-1111-1111-1111-111111111111',
      name: 'Static Signal',
      slug: 'static-signal',
      entityType: 'band' as const,
      members: [
        { name: 'Alex Volt', email: 'alex@example.com', city: 'Austin', instrument: 'Guitar' },
        { name: 'Sam Pulse', email: 'sam@example.com', city: 'Austin', instrument: 'Drums' },
      ],
    };

    await expect(controller.submitArtistBandRegistration(dto, { user: { userId: 'u-1' } })).rejects.toThrow(
      ForbiddenException,
    );
    expect(registrarService.submitArtistBandRegistration).toHaveBeenCalledWith('u-1', dto);
  });

  it('materializes artist/band registration through registrar service', async () => {
    const registrarService = {
      materializeArtistBandRegistration: jest.fn().mockResolvedValue({
        registrarEntryId: 'reg-artist-2',
        artistBandId: 'artist-band-1',
        created: true,
      }),
    } as any;
    const controller = new RegistrarController(registrarService);

    const response = await controller.materializeArtistBandRegistration('reg-artist-2', { user: { userId: 'u-1' } });

    expect(registrarService.materializeArtistBandRegistration).toHaveBeenCalledWith('u-1', 'reg-artist-2');
    expect(response).toEqual({
      success: true,
      data: {
        registrarEntryId: 'reg-artist-2',
        artistBandId: 'artist-band-1',
        created: true,
      },
    });
  });

  it('propagates artist/band materialize errors from registrar service', async () => {
    const registrarService = {
      materializeArtistBandRegistration: jest.fn().mockRejectedValue(new NotFoundException('Registrar entry not found')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(
      controller.materializeArtistBandRegistration('missing-entry', { user: { userId: 'u-1' } }),
    ).rejects.toThrow(NotFoundException);
    expect(registrarService.materializeArtistBandRegistration).toHaveBeenCalledWith('u-1', 'missing-entry');
  });

  it('reads artist/band invite status through registrar service', async () => {
    const registrarService = {
      getArtistBandInviteStatus: jest.fn().mockResolvedValue({
        registrarEntryId: 'reg-artist-2',
        totalMembers: 2,
        counts: { pending_email: 1, claimed: 1 },
      }),
    } as any;
    const controller = new RegistrarController(registrarService);

    const response = await controller.getArtistBandInviteStatus('reg-artist-2', { user: { userId: 'u-1' } });

    expect(registrarService.getArtistBandInviteStatus).toHaveBeenCalledWith('u-1', 'reg-artist-2');
    expect(response).toEqual({
      success: true,
      data: {
        registrarEntryId: 'reg-artist-2',
        totalMembers: 2,
        counts: { pending_email: 1, claimed: 1 },
      },
    });
  });

  it('propagates artist/band invite status read errors from registrar service', async () => {
    const registrarService = {
      getArtistBandInviteStatus: jest.fn().mockRejectedValue(new ForbiddenException('No access')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(controller.getArtistBandInviteStatus('reg-artist-2', { user: { userId: 'u-1' } })).rejects.toThrow(
      ForbiddenException,
    );
    expect(registrarService.getArtistBandInviteStatus).toHaveBeenCalledWith('u-1', 'reg-artist-2');
  });

  it('dispatches artist/band invites through registrar service', async () => {
    const registrarService = {
      dispatchArtistBandInvites: jest.fn().mockResolvedValue({
        registrarEntryId: 'reg-artist-2',
        dispatchedCount: 2,
        skippedCount: 0,
      }),
    } as any;
    const controller = new RegistrarController(registrarService);

    const response = await controller.dispatchArtistBandInvites(
      'reg-artist-2',
      { mobileAppUrl: 'https://m.uprise.app/download', webAppUrl: 'https://uprise.app/band' },
      { user: { userId: 'u-1' } },
    );

    expect(registrarService.dispatchArtistBandInvites).toHaveBeenCalledWith(
      'u-1',
      'reg-artist-2',
      { mobileAppUrl: 'https://m.uprise.app/download', webAppUrl: 'https://uprise.app/band' },
    );
    expect(response).toEqual({
      success: true,
      data: {
        registrarEntryId: 'reg-artist-2',
        dispatchedCount: 2,
        skippedCount: 0,
      },
    });
  });

  it('propagates artist/band invite dispatch errors from registrar service', async () => {
    const registrarService = {
      dispatchArtistBandInvites: jest.fn().mockRejectedValue(new NotFoundException('Registrar entry not found')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(
      controller.dispatchArtistBandInvites(
        'missing-entry',
        { mobileAppUrl: 'https://m.uprise.app/download', webAppUrl: 'https://uprise.app/band' },
        { user: { userId: 'u-1' } },
      ),
    ).rejects.toThrow(NotFoundException);
    expect(registrarService.dispatchArtistBandInvites).toHaveBeenCalledWith(
      'u-1',
      'missing-entry',
      { mobileAppUrl: 'https://m.uprise.app/download', webAppUrl: 'https://uprise.app/band' },
    );
  });
});
