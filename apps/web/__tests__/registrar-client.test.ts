import { api } from '../src/lib/api';
import {
  REGISTRAR_CODE_API_SCAFFOLD,
  getProjectRegistration,
  listProjectRegistrations,
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
  it('exposes published registrar code verify/redeem endpoints and keeps issue endpoint unresolved', () => {
    expect(REGISTRAR_CODE_API_SCAFFOLD).toEqual({
      issueForApprovedPromoterEntryEndpoint: null,
      redeemEndpoint: '/registrar/code/redeem',
      verifyEndpoint: '/registrar/code/verify',
    });
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

  it('throws when project detail response has no data payload', async () => {
    mockedApiGet.mockResolvedValueOnce({ success: true, data: undefined });

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
