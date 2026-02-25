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

  it('submits project registration through registrar service', async () => {
    const registrarService = {
      submitProjectRegistration: jest.fn().mockResolvedValue({
        id: 'reg-project-1',
        type: 'project_registration',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        createdById: 'u-1',
        payload: { projectName: 'All-Ages Venue Buildout' },
      }),
    } as any;

    const controller = new RegistrarController(registrarService);

    const response = await controller.submitProjectRegistration(
      {
        sceneId: '11111111-1111-1111-1111-111111111111',
        projectName: 'All-Ages Venue Buildout',
      },
      { user: { userId: 'u-1' } },
    );

    expect(registrarService.submitProjectRegistration).toHaveBeenCalledWith('u-1', {
      sceneId: '11111111-1111-1111-1111-111111111111',
      projectName: 'All-Ages Venue Buildout',
    });
    expect(response).toEqual({
      success: true,
      data: {
        id: 'reg-project-1',
        type: 'project_registration',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        createdById: 'u-1',
        payload: { projectName: 'All-Ages Venue Buildout' },
      },
    });
  });

  it('propagates project submit errors from registrar service', async () => {
    const registrarService = {
      submitProjectRegistration: jest.fn().mockRejectedValue(new ForbiddenException('No access')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(
      controller.submitProjectRegistration(
        {
          sceneId: '11111111-1111-1111-1111-111111111111',
          projectName: 'All-Ages Venue Buildout',
        },
        { user: { userId: 'u-1' } },
      ),
    ).rejects.toThrow(ForbiddenException);
    expect(registrarService.submitProjectRegistration).toHaveBeenCalledWith('u-1', {
      sceneId: '11111111-1111-1111-1111-111111111111',
      projectName: 'All-Ages Venue Buildout',
    });
  });

  it('submits sect-motion registration through registrar service', async () => {
    const registrarService = {
      submitSectMotionRegistration: jest.fn().mockResolvedValue({
        id: 'reg-sect-motion-1',
        type: 'sect_motion',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        createdById: 'u-1',
        payload: {},
      }),
    } as any;

    const controller = new RegistrarController(registrarService);

    const response = await controller.submitSectMotionRegistration(
      {
        sceneId: '11111111-1111-1111-1111-111111111111',
      },
      { user: { userId: 'u-1' } },
    );

    expect(registrarService.submitSectMotionRegistration).toHaveBeenCalledWith('u-1', {
      sceneId: '11111111-1111-1111-1111-111111111111',
    });
    expect(response).toEqual({
      success: true,
      data: {
        id: 'reg-sect-motion-1',
        type: 'sect_motion',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        createdById: 'u-1',
        payload: {},
      },
    });
  });

  it('propagates sect-motion submit errors from registrar service', async () => {
    const registrarService = {
      submitSectMotionRegistration: jest.fn().mockRejectedValue(new ForbiddenException('No access')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(
      controller.submitSectMotionRegistration(
        {
          sceneId: '11111111-1111-1111-1111-111111111111',
        },
        { user: { userId: 'u-1' } },
      ),
    ).rejects.toThrow(ForbiddenException);
    expect(registrarService.submitSectMotionRegistration).toHaveBeenCalledWith('u-1', {
      sceneId: '11111111-1111-1111-1111-111111111111',
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

  it('reads promoter capability audit through registrar service', async () => {
    const registrarService = {
      listPromoterCapabilityAudit: jest.fn().mockResolvedValue({
        registrarEntryId: 'reg-promoter-1',
        total: 2,
        events: [{ id: 'audit-2' }, { id: 'audit-1' }],
      }),
    } as any;
    const controller = new RegistrarController(registrarService);

    const response = await controller.getMyPromoterCapabilityAudit('reg-promoter-1', {
      user: { userId: 'u-1' },
    });

    expect(registrarService.listPromoterCapabilityAudit).toHaveBeenCalledWith('u-1', 'reg-promoter-1');
    expect(response).toEqual({
      success: true,
      data: {
        registrarEntryId: 'reg-promoter-1',
        total: 2,
        events: [{ id: 'audit-2' }, { id: 'audit-1' }],
      },
    });
  });

  it('propagates promoter capability audit read errors from registrar service', async () => {
    const registrarService = {
      listPromoterCapabilityAudit: jest.fn().mockRejectedValue(new ForbiddenException('No access')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(
      controller.getMyPromoterCapabilityAudit('reg-promoter-1', { user: { userId: 'u-1' } }),
    ).rejects.toThrow(ForbiddenException);
    expect(registrarService.listPromoterCapabilityAudit).toHaveBeenCalledWith('u-1', 'reg-promoter-1');
  });

  it('verifies registrar code through registrar service', async () => {
    const registrarService = {
      verifyRegistrarCode: jest.fn().mockResolvedValue({
        id: 'rcode-1',
        registrarEntryId: 'reg-promoter-1',
        capability: 'promoter_capability',
        status: 'issued',
        redeemable: true,
      }),
    } as any;

    const controller = new RegistrarController(registrarService);

    const response = await controller.verifyRegistrarCode({ code: 'PRC-VALID-CODE' });

    expect(registrarService.verifyRegistrarCode).toHaveBeenCalledWith('PRC-VALID-CODE');
    expect(response).toEqual({
      success: true,
      data: expect.objectContaining({
        id: 'rcode-1',
        registrarEntryId: 'reg-promoter-1',
        status: 'issued',
        redeemable: true,
      }),
    });
  });

  it('propagates registrar code verify errors from registrar service', async () => {
    const registrarService = {
      verifyRegistrarCode: jest.fn().mockRejectedValue(new NotFoundException('Registrar code not found')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(controller.verifyRegistrarCode({ code: 'PRC-MISSING' })).rejects.toThrow(NotFoundException);
    expect(registrarService.verifyRegistrarCode).toHaveBeenCalledWith('PRC-MISSING');
  });

  it('redeems registrar code through registrar service', async () => {
    const registrarService = {
      redeemRegistrarCodeForUser: jest.fn().mockResolvedValue({
        id: 'rcode-1',
        registrarEntryId: 'reg-promoter-1',
        capability: 'promoter_capability',
        status: 'redeemed',
        redeemedByUserId: 'u-1',
      }),
    } as any;
    const controller = new RegistrarController(registrarService);

    const response = await controller.redeemRegistrarCode(
      { code: 'PRC-VALID-CODE' },
      { user: { userId: 'u-1' } },
    );

    expect(registrarService.redeemRegistrarCodeForUser).toHaveBeenCalledWith('u-1', 'PRC-VALID-CODE');
    expect(response).toEqual({
      success: true,
      data: expect.objectContaining({
        id: 'rcode-1',
        registrarEntryId: 'reg-promoter-1',
        status: 'redeemed',
        redeemedByUserId: 'u-1',
      }),
    });
  });

  it('propagates registrar code redeem errors from registrar service', async () => {
    const registrarService = {
      redeemRegistrarCodeForUser: jest.fn().mockRejectedValue(new ForbiddenException('Registrar code has expired')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(
      controller.redeemRegistrarCode({ code: 'PRC-EXPIRED' }, { user: { userId: 'u-1' } }),
    ).rejects.toThrow(ForbiddenException);
    expect(registrarService.redeemRegistrarCodeForUser).toHaveBeenCalledWith('u-1', 'PRC-EXPIRED');
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

  it('syncs artist/band members through registrar service', async () => {
    const registrarService = {
      syncArtistBandMembers: jest.fn().mockResolvedValue({
        registrarEntryId: 'reg-artist-2',
        syncedCount: 2,
        alreadyLinkedCount: 1,
      }),
    } as any;
    const controller = new RegistrarController(registrarService);

    const response = await controller.syncArtistBandMembers('reg-artist-2', { user: { userId: 'u-1' } });

    expect(registrarService.syncArtistBandMembers).toHaveBeenCalledWith('u-1', 'reg-artist-2');
    expect(response).toEqual({
      success: true,
      data: {
        registrarEntryId: 'reg-artist-2',
        syncedCount: 2,
        alreadyLinkedCount: 1,
      },
    });
  });

  it('propagates artist/band member sync errors from registrar service', async () => {
    const registrarService = {
      syncArtistBandMembers: jest.fn().mockRejectedValue(new ForbiddenException('Only the submitter can sync members')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(controller.syncArtistBandMembers('reg-artist-2', { user: { userId: 'u-1' } })).rejects.toThrow(
      ForbiddenException,
    );
    expect(registrarService.syncArtistBandMembers).toHaveBeenCalledWith('u-1', 'reg-artist-2');
  });
});
