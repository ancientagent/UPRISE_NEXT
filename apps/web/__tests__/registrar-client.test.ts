import { api } from '../src/lib/api';
import {
  dispatchArtistBandInvites,
  getPromoterCapabilityAudit,
  getPromoterRegistration,
  listArtistBandRegistrations,
  getSectMotionRegistration,
  REGISTRAR_CODE_API_SCAFFOLD,
  getProjectRegistration,
  materializeArtistBandRegistration,
  listPromoterRegistrations,
  listSectMotionRegistrations,
  listProjectRegistrations,
  loadArtistBandInviteStatus,
  redeemRegistrarCode,
  submitArtistBandRegistration,
  submitPromoterRegistration,
  submitProjectRegistration,
  syncArtistBandMembers,
  verifyRegistrarCode,
} from '../src/lib/registrar/client';

jest.mock('../src/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('registrar client scaffolding', () => {
  const mockedApiPost = api.post as jest.Mock;

  beforeEach(() => {
    mockedApiPost.mockReset();
  });

  it('exposes published registrar code verify/redeem endpoints and keeps issue endpoint unresolved', () => {
    expect(REGISTRAR_CODE_API_SCAFFOLD).toEqual({
      issueForApprovedPromoterEntryEndpoint: null,
      redeemEndpoint: '/registrar/code/redeem',
      verifyEndpoint: '/registrar/code/verify',
    });
  });

  it('calls registrar code verify endpoint and returns typed payload', async () => {
    mockedApiPost.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'rcode-1',
        registrarEntryId: 'reg-promoter-1',
        capability: 'promoter_capability',
        issuerType: 'system',
        status: 'issued',
        expiresAt: null,
        createdAt: '2026-02-26T00:00:00.000Z',
        redeemable: true,
      },
    });

    const response = await verifyRegistrarCode('PRC-VALID-CODE', 'token-1');

    expect(mockedApiPost).toHaveBeenCalledWith('/registrar/code/verify', { code: 'PRC-VALID-CODE' }, {
      token: 'token-1',
    });
    expect(response).toEqual(
      expect.objectContaining({
        id: 'rcode-1',
        capability: 'promoter_capability',
        issuerType: 'system',
        status: 'issued',
        expiresAt: null,
        createdAt: '2026-02-26T00:00:00.000Z',
        redeemable: true,
      }),
    );
    expect(Object.keys(response).sort()).toEqual([
      'capability',
      'createdAt',
      'expiresAt',
      'id',
      'issuerType',
      'redeemable',
      'registrarEntryId',
      'status',
    ]);
  });

  it('throws when registrar code verify response has no data payload', async () => {
    mockedApiPost.mockResolvedValueOnce({ success: true, data: undefined });

    await expect(verifyRegistrarCode('PRC-VALID-CODE', 'token-1')).rejects.toThrow(
      'Registrar code verify response was empty.',
    );
  });

  it('calls registrar code redeem endpoint and returns typed payload', async () => {
    mockedApiPost.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'rcode-1',
        registrarEntryId: 'reg-promoter-1',
        capability: 'promoter_capability',
        issuerType: 'system',
        status: 'redeemed',
        expiresAt: null,
        redeemedAt: '2026-02-26T01:00:00.000Z',
        createdAt: '2026-02-26T00:00:00.000Z',
      },
    });

    const response = await redeemRegistrarCode('PRC-VALID-CODE', 'token-1');

    expect(mockedApiPost).toHaveBeenCalledWith('/registrar/code/redeem', { code: 'PRC-VALID-CODE' }, {
      token: 'token-1',
    });
    expect(response).toEqual(
      expect.objectContaining({
        id: 'rcode-1',
        capability: 'promoter_capability',
        issuerType: 'system',
        status: 'redeemed',
        expiresAt: null,
        redeemedAt: '2026-02-26T01:00:00.000Z',
        createdAt: '2026-02-26T00:00:00.000Z',
      }),
    );
    expect(Object.keys(response).sort()).toEqual([
      'capability',
      'createdAt',
      'expiresAt',
      'id',
      'issuerType',
      'redeemedAt',
      'registrarEntryId',
      'status',
    ]);
  });

  it('throws when registrar code redeem response has no data payload', async () => {
    mockedApiPost.mockResolvedValueOnce({ success: true, data: undefined });

    await expect(redeemRegistrarCode('PRC-VALID-CODE', 'token-1')).rejects.toThrow(
      'Registrar code redeem response was empty.',
    );
  });

  it('calls promoter registration submit endpoint and returns typed payload', async () => {
    mockedApiPost.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'reg-promoter-1',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        createdById: 'u-1',
        payload: { productionName: 'Southside Signal Co.' },
        createdAt: '2026-02-26T00:00:00.000Z',
      },
    });

    const response = await submitPromoterRegistration(
      {
        sceneId: 'scene-1',
        productionName: 'Southside Signal Co.',
      },
      'token-1',
    );

    expect(mockedApiPost).toHaveBeenCalledWith(
      '/registrar/promoter',
      {
        sceneId: 'scene-1',
        productionName: 'Southside Signal Co.',
      },
      { token: 'token-1' },
    );
    expect(response).toEqual(
      expect.objectContaining({
        id: 'reg-promoter-1',
        type: 'promoter_registration',
        status: 'submitted',
        payload: { productionName: 'Southside Signal Co.' },
      }),
    );
  });

  it('throws when promoter registration submit response has no data payload', async () => {
    mockedApiPost.mockResolvedValueOnce({ success: true, data: undefined });

    await expect(
      submitPromoterRegistration(
        {
          sceneId: 'scene-1',
          productionName: 'Southside Signal Co.',
        },
        'token-1',
      ),
    ).rejects.toThrow('Promoter registration response returned no data.');
  });

  it('propagates forbidden error from registrar code verify endpoint', async () => {
    mockedApiPost.mockRejectedValueOnce(new Error('Forbidden'));

    await expect(verifyRegistrarCode('PRC-FORBIDDEN', 'token-1')).rejects.toThrow('Forbidden');
  });

  it('propagates not-found error from registrar code verify endpoint', async () => {
    mockedApiPost.mockRejectedValueOnce(new Error('Registrar code not found'));

    await expect(verifyRegistrarCode('PRC-NOT-FOUND', 'token-1')).rejects.toThrow('Registrar code not found');
  });

  it('propagates invalid-state error from registrar code redeem endpoint', async () => {
    mockedApiPost.mockRejectedValueOnce(new Error('Registrar code cannot be redeemed in current state'));

    await expect(redeemRegistrarCode('PRC-ALREADY-REDEEMED', 'token-1')).rejects.toThrow(
      'Registrar code cannot be redeemed in current state',
    );
  });
});

describe('registrar project read client scaffolding', () => {
  const mockedApiGet = api.get as jest.Mock;

  beforeEach(() => {
    mockedApiGet.mockReset();
  });

  it('calls list project endpoint and returns fallback when data is empty', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: undefined });

    const response = await listProjectRegistrations('token-1');

    expect(mockedApiGet).toHaveBeenCalledWith('/registrar/project/entries', { token: 'token-1' });
    expect(response).toEqual({ total: 0, countsByStatus: {}, entries: [] });
  });

  it('calls list project endpoint and returns fallback when data is null', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: null });

    const response = await listProjectRegistrations('token-1');

    expect(mockedApiGet).toHaveBeenCalledWith('/registrar/project/entries', { token: 'token-1' });
    expect(response).toEqual({ total: 0, countsByStatus: {}, entries: [] });
  });

  it('calls project detail endpoint and returns payload', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'reg-project-1',
        type: 'project_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { projectName: null },
        scene: null,
        createdAt: '2026-02-26T00:00:00.000Z',
        updatedAt: '2026-02-26T00:00:00.000Z',
      },
    });

    const response = await getProjectRegistration('reg-project-1', 'token-1');

    expect(mockedApiGet).toHaveBeenCalledWith('/registrar/project/reg-project-1', { token: 'token-1' });
    expect(response).toEqual(
      expect.objectContaining({
        id: 'reg-project-1',
        payload: { projectName: null },
      }),
    );
  });

  it('preserves nullable fields in project detail response shape', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'reg-project-2',
        type: 'project_registration',
        status: 'approved',
        sceneId: 'scene-2',
        payload: { projectName: null },
        scene: {
          id: 'scene-2',
          name: 'Austin Pulse',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'Underground',
          tier: 'city',
        },
        createdAt: '2026-02-27T02:00:00.000Z',
        updatedAt: '2026-02-27T02:05:00.000Z',
      },
    });

    const response = await getProjectRegistration('reg-project-2', 'token-2');

    expect(response).toEqual(
      expect.objectContaining({
        payload: { projectName: null },
        scene: expect.objectContaining({
          id: 'scene-2',
          tier: 'city',
        }),
      }),
    );
  });

  it('keeps project detail contract stable when scene is null and projectName is present', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'reg-project-3',
        type: 'project_registration',
        status: 'submitted',
        sceneId: 'scene-3',
        payload: { projectName: 'Night Transit' },
        scene: null,
        createdAt: '2026-02-28T01:00:00.000Z',
        updatedAt: '2026-02-28T01:05:00.000Z',
      },
    });

    const response = await getProjectRegistration('reg-project-3', 'token-3');

    expect(response).toEqual(
      expect.objectContaining({
        payload: { projectName: 'Night Transit' },
        scene: null,
      }),
    );
  });

  it('throws when project detail response has no data payload', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: undefined });

    await expect(getProjectRegistration('reg-project-1', 'token-1')).rejects.toThrow(
      'Project registration response was empty.',
    );
  });

  it('throws when project detail response data is null', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: null });

    await expect(getProjectRegistration('reg-project-1', 'token-1')).rejects.toThrow(
      'Project registration response was empty.',
    );
  });

  it('returns project list payload unchanged when data is present', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        total: 1,
        countsByStatus: { submitted: 1 },
        entries: [
          {
            id: 'reg-project-1',
            type: 'project_registration',
            status: 'submitted',
            sceneId: 'scene-1',
            payload: { projectName: 'Buildout' },
            scene: null,
            createdAt: '2026-02-26T00:00:00.000Z',
            updatedAt: '2026-02-26T00:00:00.000Z',
          },
        ],
      },
    });

    const response = await listProjectRegistrations('token-1');

    expect(Object.keys(response).sort()).toEqual(['countsByStatus', 'entries', 'total']);
    expect(response).toEqual({
      total: 1,
      countsByStatus: { submitted: 1 },
      entries: [
        expect.objectContaining({
          id: 'reg-project-1',
          payload: { projectName: 'Buildout' },
        }),
      ],
    });
  });
});

describe('registrar sect-motion read client scaffolding', () => {
  const mockedApiGet = api.get as jest.Mock;

  beforeEach(() => {
    mockedApiGet.mockReset();
  });

  it('calls sect-motion list endpoint and returns fallback when data is empty', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: undefined });

    const response = await listSectMotionRegistrations('token-1');

    expect(mockedApiGet).toHaveBeenCalledWith('/registrar/sect-motion/entries', { token: 'token-1' });
    expect(response).toEqual({ total: 0, countsByStatus: {}, entries: [] });
  });

  it('calls sect-motion list endpoint and returns fallback when data is null', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: null });

    const response = await listSectMotionRegistrations('token-1');

    expect(mockedApiGet).toHaveBeenCalledWith('/registrar/sect-motion/entries', { token: 'token-1' });
    expect(response).toEqual({ total: 0, countsByStatus: {}, entries: [] });
  });

  it('calls sect-motion detail endpoint and returns payload', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'reg-sect-1',
        type: 'sect_motion',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: {},
        scene: null,
        createdAt: '2026-02-26T00:00:00.000Z',
        updatedAt: '2026-02-26T00:00:00.000Z',
      },
    });

    const response = await getSectMotionRegistration('reg-sect-1', 'token-1');

    expect(mockedApiGet).toHaveBeenCalledWith('/registrar/sect-motion/reg-sect-1', { token: 'token-1' });
    expect(response).toEqual(
      expect.objectContaining({
        id: 'reg-sect-1',
        type: 'sect_motion',
      }),
    );
  });

  it('preserves nullable fields in sect-motion detail response shape', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'reg-sect-2',
        type: 'sect_motion',
        status: 'approved',
        sceneId: 'scene-2',
        payload: {
          notes: null,
          priority: 'low',
        },
        scene: null,
        createdAt: '2026-02-27T03:00:00.000Z',
        updatedAt: '2026-02-27T03:15:00.000Z',
      },
    });

    const response = await getSectMotionRegistration('reg-sect-2', 'token-2');

    expect(response).toEqual(
      expect.objectContaining({
        payload: expect.objectContaining({
          notes: null,
          priority: 'low',
        }),
        scene: null,
      }),
    );
  });

  it('keeps sect-motion detail contract stable when scene is present and payload contains nullable keys', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'reg-sect-3',
        type: 'sect_motion',
        status: 'submitted',
        sceneId: 'scene-3',
        payload: {
          notes: null,
          rationale: 'community_priority',
        },
        scene: {
          id: 'scene-3',
          name: 'Northside Echo',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'Indie',
          tier: 'city',
        },
        createdAt: '2026-02-28T01:20:00.000Z',
        updatedAt: '2026-02-28T01:25:00.000Z',
      },
    });

    const response = await getSectMotionRegistration('reg-sect-3', 'token-3');

    expect(response).toEqual(
      expect.objectContaining({
        payload: expect.objectContaining({ notes: null, rationale: 'community_priority' }),
        scene: expect.objectContaining({ id: 'scene-3', tier: 'city' }),
      }),
    );
  });

  it('keeps project/sect nullable mapping parity for mixed null/non-null payload keys', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'reg-project-4',
        type: 'project_registration',
        status: 'approved',
        sceneId: 'scene-4',
        payload: {
          projectName: null,
        },
        scene: {
          id: 'scene-4',
          name: 'Southline',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'Alternative',
          tier: 'city',
        },
        createdAt: '2026-02-28T03:00:00.000Z',
        updatedAt: '2026-02-28T03:10:00.000Z',
      },
    });
    const project = await getProjectRegistration('reg-project-4', 'token-4');

    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'reg-sect-4',
        type: 'sect_motion',
        status: 'approved',
        sceneId: 'scene-4',
        payload: {
          notes: null,
          reason: 'rotation_update',
        },
        scene: null,
        createdAt: '2026-02-28T03:12:00.000Z',
        updatedAt: '2026-02-28T03:15:00.000Z',
      },
    });
    const sect = await getSectMotionRegistration('reg-sect-4', 'token-4');

    expect(project.payload).toEqual({ projectName: null });
    expect(project.scene).toEqual(expect.objectContaining({ id: 'scene-4', tier: 'city' }));
    expect(sect.payload).toEqual(expect.objectContaining({ notes: null, reason: 'rotation_update' }));
    expect(sect.scene).toBeNull();
  });

  it('keeps project/sect nullable mapping parity when project scene is null and sect scene is present', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'reg-project-5',
        type: 'project_registration',
        status: 'submitted',
        sceneId: 'scene-5',
        payload: { projectName: 'Signal Bloom' },
        scene: null,
        createdAt: '2026-02-28T05:00:00.000Z',
        updatedAt: '2026-02-28T05:10:00.000Z',
      },
    });
    const project = await getProjectRegistration('reg-project-5', 'token-5');

    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'reg-sect-5',
        type: 'sect_motion',
        status: 'submitted',
        sceneId: 'scene-5',
        payload: {
          notes: null,
          reason: 'schedule_alignment',
        },
        scene: {
          id: 'scene-5',
          name: 'Central Pulse',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'Electronic',
          tier: 'city',
        },
        createdAt: '2026-02-28T05:12:00.000Z',
        updatedAt: '2026-02-28T05:18:00.000Z',
      },
    });
    const sect = await getSectMotionRegistration('reg-sect-5', 'token-5');

    expect(project.payload).toEqual({ projectName: 'Signal Bloom' });
    expect(project.scene).toBeNull();
    expect(sect.payload).toEqual(expect.objectContaining({ notes: null, reason: 'schedule_alignment' }));
    expect(sect.scene).toEqual(expect.objectContaining({ id: 'scene-5', tier: 'city' }));
  });

  it('keeps project/sect nullable mapping parity across list responses', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        total: 1,
        countsByStatus: { submitted: 1 },
        entries: [
          {
            id: 'reg-project-6',
            type: 'project_registration',
            status: 'submitted',
            sceneId: 'scene-6',
            payload: { projectName: null },
            scene: null,
            createdAt: '2026-02-28T06:00:00.000Z',
            updatedAt: '2026-02-28T06:05:00.000Z',
          },
        ],
      },
    });
    const projects = await listProjectRegistrations('token-6');

    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        total: 1,
        countsByStatus: { submitted: 1 },
        entries: [
          {
            id: 'reg-sect-6',
            type: 'sect_motion',
            status: 'submitted',
            sceneId: 'scene-6',
            payload: { notes: null, reason: 'community_update' },
            scene: null,
            createdAt: '2026-02-28T06:06:00.000Z',
            updatedAt: '2026-02-28T06:08:00.000Z',
          },
        ],
      },
    });
    const sects = await listSectMotionRegistrations('token-6');

    expect(projects.countsByStatus).toEqual({ submitted: 1 });
    expect(projects.entries[0]).toEqual(
      expect.objectContaining({
        payload: { projectName: null },
        scene: null,
      }),
    );
    expect(sects.countsByStatus).toEqual({ submitted: 1 });
    expect(sects.entries[0]).toEqual(
      expect.objectContaining({
        payload: expect.objectContaining({ notes: null, reason: 'community_update' }),
        scene: null,
      }),
    );
  });

  it('throws when sect-motion detail response has no data payload', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: undefined });

    await expect(getSectMotionRegistration('reg-sect-1', 'token-1')).rejects.toThrow(
      'Sect-motion registration response was empty.',
    );
  });

  it('throws when sect-motion detail response data is null', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: null });

    await expect(getSectMotionRegistration('reg-sect-1', 'token-1')).rejects.toThrow(
      'Sect-motion registration response was empty.',
    );
  });
});

describe('registrar promoter read client scaffolding', () => {
  const mockedApiGet = api.get as jest.Mock;

  beforeEach(() => {
    mockedApiGet.mockReset();
  });

  it('calls promoter list endpoint and returns fallback when data is empty', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: undefined });

    const response = await listPromoterRegistrations('token-1');

    expect(mockedApiGet).toHaveBeenCalledWith('/registrar/promoter/entries', { token: 'token-1' });
    expect(response).toEqual({ total: 0, countsByStatus: {}, entries: [] });
  });

  it('calls promoter list endpoint and returns fallback when data is null', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: null });

    const response = await listPromoterRegistrations('token-1');

    expect(mockedApiGet).toHaveBeenCalledWith('/registrar/promoter/entries', { token: 'token-1' });
    expect(response).toEqual({ total: 0, countsByStatus: {}, entries: [] });
  });

  it('calls promoter detail endpoint and returns payload', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'reg-promoter-1',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { productionName: 'Southside Signal Co.' },
        promoterCapability: {
          codeIssuedCount: 0,
          latestCodeStatus: null,
          latestCodeIssuedAt: null,
          latestCodeRedeemedAt: null,
          granted: false,
          grantedAt: null,
        },
        scene: null,
        createdAt: '2026-02-26T00:00:00.000Z',
        updatedAt: '2026-02-26T00:00:00.000Z',
      },
    });

    const response = await getPromoterRegistration('reg-promoter-1', 'token-1');

    expect(mockedApiGet).toHaveBeenCalledWith('/registrar/promoter/reg-promoter-1', { token: 'token-1' });
    expect(response).toEqual(
      expect.objectContaining({
        id: 'reg-promoter-1',
        payload: { productionName: 'Southside Signal Co.' },
        promoterCapability: expect.objectContaining({
          codeIssuedCount: 0,
          latestCodeStatus: null,
          granted: false,
          grantedAt: null,
        }),
      }),
    );
  });

  it('calls promoter capability-audit endpoint and returns payload', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-promoter-1',
        total: 1,
        events: [
          {
            id: 'audit-1',
            action: 'code_issued',
            actorType: 'system',
            targetUserId: 'u-1',
            actorUserId: null,
            registrarCodeId: 'rcode-1',
            metadata: { issuerType: 'system' },
            createdAt: '2026-02-26T00:00:00.000Z',
          },
        ],
      },
    });

    const response = await getPromoterCapabilityAudit('reg-promoter-1', 'token-1');

    expect(mockedApiGet).toHaveBeenCalledWith('/registrar/promoter/reg-promoter-1/capability-audit', {
      token: 'token-1',
    });
    expect(response).toEqual(
      expect.objectContaining({
        registrarEntryId: 'reg-promoter-1',
        total: 1,
        events: [
          expect.objectContaining({
            id: 'audit-1',
            action: 'code_issued',
            actorType: 'system',
            metadata: expect.objectContaining({ issuerType: 'system' }),
          }),
        ],
      }),
    );
    expect(response.events[0]?.actorUserId).toBeNull();
  });

  it('preserves capability-audit event ordering and nullable/additive event fields', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-promoter-9',
        total: 2,
        events: [
          {
            id: 'audit-2',
            action: 'capability_granted',
            actorType: 'admin',
            targetUserId: 'u-9',
            actorUserId: 'admin-1',
            registrarCodeId: null,
            metadata: {
              reason: 'manual_review',
              source: 'ops_console',
              additiveFlag: true,
            },
            createdAt: '2026-02-27T08:00:00.000Z',
          },
          {
            id: 'audit-1',
            action: 'code_issued',
            actorType: 'system',
            targetUserId: 'u-9',
            actorUserId: null,
            registrarCodeId: 'rcode-9',
            metadata: null,
            createdAt: '2026-02-27T07:00:00.000Z',
          },
        ],
      },
    });

    const response = await getPromoterCapabilityAudit('reg-promoter-9', 'token-9');

    expect(response.registrarEntryId).toBe('reg-promoter-9');
    expect(response.total).toBe(2);
    expect(response.events.map((event) => event.id)).toEqual(['audit-2', 'audit-1']);
    expect(response.events[0]).toEqual(
      expect.objectContaining({
        actorUserId: 'admin-1',
        registrarCodeId: null,
        metadata: expect.objectContaining({
          reason: 'manual_review',
          source: 'ops_console',
          additiveFlag: true,
        }),
      }),
    );
    expect(response.events[1]).toEqual(
      expect.objectContaining({
        actorUserId: null,
        metadata: null,
      }),
    );
  });

  it('handles capability-audit empty-state and sparse nullable event payloads', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-promoter-empty',
        total: 0,
        events: [],
      },
    });

    const emptyResponse = await getPromoterCapabilityAudit('reg-promoter-empty', 'token-empty');

    expect(emptyResponse).toEqual({
      registrarEntryId: 'reg-promoter-empty',
      total: 0,
      events: [],
    });

    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-promoter-sparse',
        total: 1,
        events: [
          {
            id: 'audit-sparse-1',
            action: 'code_issued',
            actorType: 'system',
            targetUserId: null,
            actorUserId: null,
            registrarCodeId: null,
            metadata: null,
            createdAt: '2026-02-27T09:00:00.000Z',
          },
        ],
      },
    });

    const sparseResponse = await getPromoterCapabilityAudit('reg-promoter-sparse', 'token-sparse');

    expect(sparseResponse.events[0]).toEqual(
      expect.objectContaining({
        id: 'audit-sparse-1',
        targetUserId: null,
        actorUserId: null,
        registrarCodeId: null,
        metadata: null,
      }),
    );
  });

  it('preserves sparse capability-audit event arrays when total exceeds materialized rows', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-promoter-queue-lag',
        total: 3,
        events: [
          {
            id: 'audit-lag-3',
            action: 'capability_granted',
            actorType: 'admin',
            targetUserId: 'u-300',
            actorUserId: 'admin-300',
            registrarCodeId: null,
            metadata: {
              reason: 'manual',
              additiveContext: { source: 'ops' },
            },
            createdAt: '2026-02-28T00:03:00.000Z',
          },
          {
            id: 'audit-lag-2',
            action: 'code_issued',
            actorType: 'system',
            targetUserId: 'u-300',
            actorUserId: null,
            registrarCodeId: 'rcode-300',
            metadata: null,
            createdAt: '2026-02-28T00:02:00.000Z',
          },
        ],
      },
    });

    const response = await getPromoterCapabilityAudit('reg-promoter-queue-lag', 'token-lag');

    expect(response.total).toBe(3);
    expect(response.events).toHaveLength(2);
    expect(response.events[0]).toEqual(
      expect.objectContaining({
        id: 'audit-lag-3',
        metadata: expect.objectContaining({
          reason: 'manual',
          additiveContext: expect.objectContaining({ source: 'ops' }),
        }),
      }),
    );
    expect(response.events[1]).toEqual(
      expect.objectContaining({
        id: 'audit-lag-2',
        actorUserId: null,
        metadata: null,
      }),
    );
  });

  it('preserves sparse capability-audit payloads with additive nested metadata arrays', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-promoter-sparse-meta',
        total: 2,
        events: [
          {
            id: 'audit-sparse-meta-1',
            action: 'capability_granted',
            actorType: 'admin',
            targetUserId: 'u-401',
            actorUserId: 'admin-401',
            registrarCodeId: null,
            metadata: {
              reason: 'manual_review',
              tags: ['ops', 'priority'],
              extra: { source: 'console' },
            },
            createdAt: '2026-02-28T02:00:00.000Z',
          },
        ],
      },
    });

    const response = await getPromoterCapabilityAudit('reg-promoter-sparse-meta', 'token-401');

    expect(response.total).toBe(2);
    expect(response.events).toHaveLength(1);
    expect(response.events[0]).toEqual(
      expect.objectContaining({
        id: 'audit-sparse-meta-1',
        metadata: expect.objectContaining({
          reason: 'manual_review',
          tags: ['ops', 'priority'],
          extra: expect.objectContaining({ source: 'console' }),
        }),
      }),
    );
  });

  it('preserves sparse capability-audit payloads when additive metadata contains nullable arrays', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-promoter-sparse-meta-2',
        total: 2,
        events: [
          {
            id: 'audit-sparse-meta-2',
            action: 'code_issued',
            actorType: 'system',
            targetUserId: 'u-402',
            actorUserId: null,
            registrarCodeId: 'rcode-402',
            metadata: {
              tags: [],
              notes: null,
              context: { issuerType: 'system' },
            },
            createdAt: '2026-02-28T04:00:00.000Z',
          },
        ],
      },
    });

    const response = await getPromoterCapabilityAudit('reg-promoter-sparse-meta-2', 'token-402');

    expect(response.total).toBe(2);
    expect(response.events).toHaveLength(1);
    expect(response.events[0]).toEqual(
      expect.objectContaining({
        id: 'audit-sparse-meta-2',
        metadata: expect.objectContaining({
          tags: [],
          notes: null,
          context: expect.objectContaining({ issuerType: 'system' }),
        }),
      }),
    );
  });

  it('throws when promoter detail response has no data payload', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: undefined });

    await expect(getPromoterRegistration('reg-promoter-1', 'token-1')).rejects.toThrow(
      'Promoter registration response was empty.',
    );
  });

  it('throws when promoter detail response data is null', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: null });

    await expect(getPromoterRegistration('reg-promoter-1', 'token-1')).rejects.toThrow(
      'Promoter registration response was empty.',
    );
  });

  it('throws when promoter capability-audit response has no data payload', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: undefined });

    await expect(getPromoterCapabilityAudit('reg-promoter-1', 'token-1')).rejects.toThrow(
      'Promoter capability audit response was empty.',
    );
  });

  it('throws when promoter capability-audit response data is null', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: null });

    await expect(getPromoterCapabilityAudit('reg-promoter-1', 'token-1')).rejects.toThrow(
      'Promoter capability audit response was empty.',
    );
  });

  it('returns promoter list payload unchanged when data is present', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        total: 1,
        countsByStatus: { approved: 1 },
        entries: [
          {
            id: 'reg-promoter-1',
            type: 'promoter_registration',
            status: 'approved',
            sceneId: 'scene-1',
            payload: { productionName: 'Southside Signal Co.' },
            promoterCapability: {
              codeIssuedCount: 2,
              latestCodeStatus: 'issued',
              latestCodeIssuedAt: '2026-02-26T10:00:00.000Z',
              latestCodeRedeemedAt: null,
              granted: false,
              grantedAt: null,
            },
            scene: null,
            createdAt: '2026-02-26T00:00:00.000Z',
            updatedAt: '2026-02-26T00:00:00.000Z',
          },
        ],
      },
    });

    const response = await listPromoterRegistrations('token-1');

    expect(Object.keys(response).sort()).toEqual(['countsByStatus', 'entries', 'total']);
    expect(response).toEqual({
      total: 1,
      countsByStatus: { approved: 1 },
      entries: [
        expect.objectContaining({
          id: 'reg-promoter-1',
          type: 'promoter_registration',
          payload: { productionName: 'Southside Signal Co.' },
        }),
      ],
    });
  });
});

describe('registrar invite-status read client scaffolding', () => {
  const mockedApiGet = api.get as jest.Mock;

  beforeEach(() => {
    mockedApiGet.mockReset();
  });

  it('passes through invite delivery outcome fields from invite-status response', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-artist-1',
        totalMembers: 2,
        countsByStatus: { sent: 1, failed: 1 },
        members: [
          {
            id: 'ram-1',
            name: 'Sam Pulse',
            email: 'sam@example.com',
            city: 'Austin',
            instrument: 'Drums',
            inviteStatus: 'sent',
            existingUserId: null,
            claimedUserId: null,
            inviteTokenExpiresAt: '2026-03-06T00:00:00.000Z',
            deliveryStatus: 'sent',
            sentAt: '2026-02-26T01:00:00.000Z',
            failedAt: null,
          },
          {
            id: 'ram-2',
            name: 'Alex Volt',
            email: 'alex@example.com',
            city: 'Austin',
            instrument: 'Guitar',
            inviteStatus: 'failed',
            existingUserId: null,
            claimedUserId: null,
            inviteTokenExpiresAt: '2026-03-06T00:00:00.000Z',
            deliveryStatus: 'failed',
            sentAt: null,
            failedAt: '2026-02-26T01:30:00.000Z',
          },
        ],
      },
    });

    const response = await loadArtistBandInviteStatus('reg-artist-1', 'token-1');

    expect(mockedApiGet).toHaveBeenCalledWith('/registrar/artist/reg-artist-1/invites', { token: 'token-1' });
    expect(response).toEqual(
      expect.objectContaining({
        registrarEntryId: 'reg-artist-1',
        countsByStatus: { sent: 1, failed: 1 },
      }),
    );
    expect(response.members[0]).toEqual(expect.objectContaining({ deliveryStatus: 'sent', sentAt: expect.any(String) }));
    expect(response.members[1]).toEqual(
      expect.objectContaining({ deliveryStatus: 'failed', failedAt: expect.any(String) }),
    );
  });

  it('keeps queued/claimed invite outcomes with stable nullable field mapping', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-artist-2',
        totalMembers: 2,
        countsByStatus: { queued: 1, claimed: 1 },
        members: [
          {
            id: 'ram-3',
            name: 'River Echo',
            email: 'river@example.com',
            city: 'Austin',
            instrument: 'Bass',
            inviteStatus: 'queued',
            existingUserId: null,
            claimedUserId: null,
            inviteTokenExpiresAt: null,
            deliveryStatus: 'queued',
            sentAt: null,
            failedAt: null,
          },
          {
            id: 'ram-4',
            name: 'Nora Wave',
            email: 'nora@example.com',
            city: 'Austin',
            instrument: 'Vocals',
            inviteStatus: 'claimed',
            existingUserId: null,
            claimedUserId: 'user-44',
            inviteTokenExpiresAt: null,
            deliveryStatus: null,
            sentAt: null,
            failedAt: null,
          },
        ],
      },
    });

    const response = await loadArtistBandInviteStatus('reg-artist-2', 'token-2');

    expect(response.countsByStatus).toEqual({ queued: 1, claimed: 1 });
    expect(response.members[0]).toEqual(
      expect.objectContaining({
        inviteStatus: 'queued',
        deliveryStatus: 'queued',
        sentAt: null,
        failedAt: null,
      }),
    );
    expect(response.members[1]).toEqual(
      expect.objectContaining({
        inviteStatus: 'claimed',
        claimedUserId: 'user-44',
        deliveryStatus: null,
        sentAt: null,
        failedAt: null,
      }),
    );
  });

  it('preserves invite summary top-level and per-entry shape stability', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-artist-shape',
        totalMembers: 3,
        countsByStatus: { queued: 1, sent: 1, failed: 1 },
        members: [
          {
            id: 'ram-s1',
            name: 'Jules',
            email: 'jules@example.com',
            city: 'Austin',
            instrument: 'Keys',
            inviteStatus: 'queued',
            existingUserId: null,
            claimedUserId: null,
            inviteTokenExpiresAt: null,
            deliveryStatus: 'queued',
            sentAt: null,
            failedAt: null,
          },
        ],
      },
    });

    const response = await loadArtistBandInviteStatus('reg-artist-shape', 'token-shape');

    expect(Object.keys(response).sort()).toEqual(['countsByStatus', 'members', 'registrarEntryId', 'totalMembers']);
    expect(Object.keys(response.members[0] ?? {}).sort()).toEqual([
      'city',
      'claimedUserId',
      'deliveryStatus',
      'email',
      'existingUserId',
      'failedAt',
      'id',
      'instrument',
      'inviteStatus',
      'inviteTokenExpiresAt',
      'name',
      'sentAt',
    ]);
    expect(response.countsByStatus).toEqual({ queued: 1, sent: 1, failed: 1 });
    expect(response.members[0]).toEqual(
      expect.objectContaining({
        inviteStatus: 'queued',
        deliveryStatus: 'queued',
        sentAt: null,
        failedAt: null,
      }),
    );
  });

  it('preserves invite summary outcome counters for claimed/existing-user outcomes', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-artist-counters',
        totalMembers: 4,
        countsByStatus: { claimed: 2, existing_user: 1, sent: 1 },
        members: [
          {
            id: 'ram-c1',
            name: 'Kai',
            email: 'kai@example.com',
            city: 'Austin',
            instrument: 'Bass',
            inviteStatus: 'claimed',
            existingUserId: null,
            claimedUserId: 'user-201',
            inviteTokenExpiresAt: null,
            deliveryStatus: null,
            sentAt: null,
            failedAt: null,
          },
          {
            id: 'ram-c2',
            name: 'Iris',
            email: 'iris@example.com',
            city: 'Austin',
            instrument: 'Drums',
            inviteStatus: 'existing_user',
            existingUserId: 'user-202',
            claimedUserId: null,
            inviteTokenExpiresAt: null,
            deliveryStatus: null,
            sentAt: null,
            failedAt: null,
          },
        ],
      },
    });

    const response = await loadArtistBandInviteStatus('reg-artist-counters', 'token-counters');

    expect(response.totalMembers).toBe(4);
    expect(response.countsByStatus).toEqual({ claimed: 2, existing_user: 1, sent: 1 });
    expect(response.members[0]).toEqual(
      expect.objectContaining({
        inviteStatus: 'claimed',
        claimedUserId: 'user-201',
        deliveryStatus: null,
      }),
    );
    expect(response.members[1]).toEqual(
      expect.objectContaining({
        inviteStatus: 'existing_user',
        existingUserId: 'user-202',
        deliveryStatus: null,
      }),
    );
  });

  it('preserves invite summary shape when counts include pending_email and failed outcomes', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-artist-shape-2',
        totalMembers: 3,
        countsByStatus: { pending_email: 1, failed: 1, sent: 1 },
        members: [
          {
            id: 'ram-s2',
            name: 'Mira',
            email: 'mira@example.com',
            city: 'Austin',
            instrument: 'Guitar',
            inviteStatus: 'pending_email',
            existingUserId: null,
            claimedUserId: null,
            inviteTokenExpiresAt: null,
            deliveryStatus: null,
            sentAt: null,
            failedAt: null,
          },
          {
            id: 'ram-s3',
            name: 'Noel',
            email: 'noel@example.com',
            city: 'Austin',
            instrument: 'Drums',
            inviteStatus: 'failed',
            existingUserId: null,
            claimedUserId: null,
            inviteTokenExpiresAt: '2026-03-07T00:00:00.000Z',
            deliveryStatus: 'failed',
            sentAt: null,
            failedAt: '2026-02-28T02:00:00.000Z',
          },
        ],
      },
    });

    const response = await loadArtistBandInviteStatus('reg-artist-shape-2', 'token-shape-2');

    expect(Object.keys(response).sort()).toEqual(['countsByStatus', 'members', 'registrarEntryId', 'totalMembers']);
    expect(response.countsByStatus).toEqual({ pending_email: 1, failed: 1, sent: 1 });
    expect(response.members[0]).toEqual(expect.objectContaining({ inviteStatus: 'pending_email', deliveryStatus: null }));
    expect(response.members[1]).toEqual(
      expect.objectContaining({ inviteStatus: 'failed', deliveryStatus: 'failed', failedAt: expect.any(String) }),
    );
  });

  it('preserves invite summary shape when counts include queued/sent/failed mix', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-artist-shape-3',
        totalMembers: 3,
        countsByStatus: { queued: 1, sent: 1, failed: 1 },
        members: [
          {
            id: 'ram-m1',
            name: 'Ari',
            email: 'ari@example.com',
            city: 'Austin',
            instrument: 'Synth',
            inviteStatus: 'queued',
            existingUserId: null,
            claimedUserId: null,
            inviteTokenExpiresAt: null,
            deliveryStatus: 'queued',
            sentAt: null,
            failedAt: null,
          },
          {
            id: 'ram-m2',
            name: 'Rin',
            email: 'rin@example.com',
            city: 'Austin',
            instrument: 'Voice',
            inviteStatus: 'sent',
            existingUserId: null,
            claimedUserId: null,
            inviteTokenExpiresAt: '2026-03-08T00:00:00.000Z',
            deliveryStatus: 'sent',
            sentAt: '2026-02-28T04:30:00.000Z',
            failedAt: null,
          },
        ],
      },
    });

    const response = await loadArtistBandInviteStatus('reg-artist-shape-3', 'token-shape-3');

    expect(Object.keys(response).sort()).toEqual(['countsByStatus', 'members', 'registrarEntryId', 'totalMembers']);
    expect(response.countsByStatus).toEqual({ queued: 1, sent: 1, failed: 1 });
    expect(response.members[0]).toEqual(
      expect.objectContaining({ inviteStatus: 'queued', deliveryStatus: 'queued', sentAt: null, failedAt: null }),
    );
    expect(response.members[1]).toEqual(
      expect.objectContaining({ inviteStatus: 'sent', deliveryStatus: 'sent', sentAt: expect.any(String) }),
    );
  });

  it('preserves invite summary top-level shape when member rows are empty', async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      data: {
        registrarEntryId: 'reg-artist-empty',
        totalMembers: 0,
        countsByStatus: {},
        members: [],
      },
    });

    const response = await loadArtistBandInviteStatus('reg-artist-empty', 'token-empty');

    expect(Object.keys(response).sort()).toEqual(['countsByStatus', 'members', 'registrarEntryId', 'totalMembers']);
    expect(response.registrarEntryId).toBe('reg-artist-empty');
    expect(response.totalMembers).toBe(0);
    expect(response.countsByStatus).toEqual({});
    expect(response.members).toEqual([]);
  });

  it('throws when invite-status response has no data payload', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: undefined });

    await expect(loadArtistBandInviteStatus('reg-artist-1', 'token-1')).rejects.toThrow(
      'Invite status response was empty.',
    );
  });
});

describe('registrar client auth-error propagation consistency', () => {
  const mockedApiGet = api.get as jest.Mock;
  const mockedApiPost = api.post as jest.Mock;

  beforeEach(() => {
    mockedApiGet.mockReset();
    mockedApiPost.mockReset();
  });

  it('propagates Unauthorized errors across registrar read methods', async () => {
    mockedApiGet.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(listProjectRegistrations('bad-token')).rejects.toThrow('Unauthorized');

    mockedApiGet.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(getProjectRegistration('reg-project-1', 'bad-token')).rejects.toThrow('Unauthorized');

    mockedApiGet.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(listSectMotionRegistrations('bad-token')).rejects.toThrow('Unauthorized');

    mockedApiGet.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(getSectMotionRegistration('reg-sect-1', 'bad-token')).rejects.toThrow('Unauthorized');

    mockedApiGet.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(listPromoterRegistrations('bad-token')).rejects.toThrow('Unauthorized');

    mockedApiGet.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(getPromoterRegistration('reg-promoter-1', 'bad-token')).rejects.toThrow('Unauthorized');

    mockedApiGet.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(getPromoterCapabilityAudit('reg-promoter-1', 'bad-token')).rejects.toThrow('Unauthorized');

    mockedApiGet.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(loadArtistBandInviteStatus('reg-artist-1', 'bad-token')).rejects.toThrow('Unauthorized');
  });

  it('propagates Unauthorized errors for registrar code verify/redeem methods', async () => {
    mockedApiPost.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(verifyRegistrarCode('PRC-1', 'bad-token')).rejects.toThrow('Unauthorized');

    mockedApiPost.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(redeemRegistrarCode('PRC-1', 'bad-token')).rejects.toThrow('Unauthorized');
  });

  it('propagates Forbidden errors across registrar read and code methods', async () => {
    mockedApiGet.mockRejectedValueOnce(new Error('Forbidden'));
    await expect(listPromoterRegistrations('forbidden-token')).rejects.toThrow('Forbidden');

    mockedApiGet.mockRejectedValueOnce(new Error('Forbidden'));
    await expect(getPromoterCapabilityAudit('reg-promoter-1', 'forbidden-token')).rejects.toThrow('Forbidden');

    mockedApiGet.mockRejectedValueOnce(new Error('Forbidden'));
    await expect(loadArtistBandInviteStatus('reg-artist-1', 'forbidden-token')).rejects.toThrow('Forbidden');

    mockedApiPost.mockRejectedValueOnce(new Error('Forbidden'));
    await expect(verifyRegistrarCode('PRC-1', 'forbidden-token')).rejects.toThrow('Forbidden');

    mockedApiPost.mockRejectedValueOnce(new Error('Forbidden'));
    await expect(redeemRegistrarCode('PRC-1', 'forbidden-token')).rejects.toThrow('Forbidden');
  });

  it('propagates token-expired auth errors consistently across read and code methods', async () => {
    mockedApiGet.mockRejectedValueOnce(new Error('Token expired'));
    await expect(getProjectRegistration('reg-project-1', 'expired-token')).rejects.toThrow('Token expired');

    mockedApiGet.mockRejectedValueOnce(new Error('Token expired'));
    await expect(getSectMotionRegistration('reg-sect-1', 'expired-token')).rejects.toThrow('Token expired');

    mockedApiGet.mockRejectedValueOnce(new Error('Token expired'));
    await expect(getPromoterRegistration('reg-promoter-1', 'expired-token')).rejects.toThrow('Token expired');

    mockedApiPost.mockRejectedValueOnce(new Error('Token expired'));
    await expect(verifyRegistrarCode('PRC-1', 'expired-token')).rejects.toThrow('Token expired');

    mockedApiPost.mockRejectedValueOnce(new Error('Token expired'));
    await expect(redeemRegistrarCode('PRC-1', 'expired-token')).rejects.toThrow('Token expired');
  });

  it('propagates invalid-token auth errors consistently across list/detail and code methods', async () => {
    mockedApiGet.mockRejectedValueOnce(new Error('Invalid token'));
    await expect(listProjectRegistrations('invalid-token')).rejects.toThrow('Invalid token');

    mockedApiGet.mockRejectedValueOnce(new Error('Invalid token'));
    await expect(getProjectRegistration('reg-project-1', 'invalid-token')).rejects.toThrow('Invalid token');

    mockedApiGet.mockRejectedValueOnce(new Error('Invalid token'));
    await expect(getPromoterCapabilityAudit('reg-promoter-1', 'invalid-token')).rejects.toThrow('Invalid token');

    mockedApiPost.mockRejectedValueOnce(new Error('Invalid token'));
    await expect(verifyRegistrarCode('PRC-1', 'invalid-token')).rejects.toThrow('Invalid token');

    mockedApiPost.mockRejectedValueOnce(new Error('Invalid token'));
    await expect(redeemRegistrarCode('PRC-1', 'invalid-token')).rejects.toThrow('Invalid token');
  });

  it('propagates Unauthorized errors for submit/list/materialize/dispatch/sync methods', async () => {
    mockedApiGet.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(listArtistBandRegistrations('bad-token')).rejects.toThrow('Unauthorized');

    mockedApiPost.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(
      submitArtistBandRegistration(
        {
          sceneId: 'scene-1',
          name: 'Night Transit',
          slug: 'night-transit',
          entityType: 'band',
          members: [],
        },
        'bad-token',
      ),
    ).rejects.toThrow('Unauthorized');

    mockedApiPost.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(
      submitProjectRegistration(
        {
          sceneId: 'scene-1',
          projectName: 'Night Transit Sessions',
        },
        'bad-token',
      ),
    ).rejects.toThrow('Unauthorized');

    mockedApiPost.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(materializeArtistBandRegistration('reg-artist-1', 'bad-token')).rejects.toThrow('Unauthorized');

    mockedApiPost.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(
      dispatchArtistBandInvites(
        'reg-artist-1',
        { mobileAppUrl: 'uprise://invite', webAppUrl: 'https://app.uprise.local/invite' },
        'bad-token',
      ),
    ).rejects.toThrow('Unauthorized');

    mockedApiPost.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(syncArtistBandMembers('reg-artist-1', 'bad-token')).rejects.toThrow('Unauthorized');
  });

  it('propagates Forbidden errors for submit/list/materialize/dispatch/sync methods', async () => {
    mockedApiGet.mockRejectedValueOnce(new Error('Forbidden'));
    await expect(listArtistBandRegistrations('forbidden-token')).rejects.toThrow('Forbidden');

    mockedApiPost.mockRejectedValueOnce(new Error('Forbidden'));
    await expect(
      submitArtistBandRegistration(
        {
          sceneId: 'scene-1',
          name: 'Night Transit',
          slug: 'night-transit',
          entityType: 'band',
          members: [],
        },
        'forbidden-token',
      ),
    ).rejects.toThrow('Forbidden');

    mockedApiPost.mockRejectedValueOnce(new Error('Forbidden'));
    await expect(
      submitProjectRegistration(
        {
          sceneId: 'scene-1',
          projectName: 'Night Transit Sessions',
        },
        'forbidden-token',
      ),
    ).rejects.toThrow('Forbidden');

    mockedApiPost.mockRejectedValueOnce(new Error('Forbidden'));
    await expect(materializeArtistBandRegistration('reg-artist-1', 'forbidden-token')).rejects.toThrow('Forbidden');

    mockedApiPost.mockRejectedValueOnce(new Error('Forbidden'));
    await expect(
      dispatchArtistBandInvites(
        'reg-artist-1',
        { mobileAppUrl: 'uprise://invite', webAppUrl: 'https://app.uprise.local/invite' },
        'forbidden-token',
      ),
    ).rejects.toThrow('Forbidden');

    mockedApiPost.mockRejectedValueOnce(new Error('Forbidden'));
    await expect(syncArtistBandMembers('reg-artist-1', 'forbidden-token')).rejects.toThrow('Forbidden');
  });
});
