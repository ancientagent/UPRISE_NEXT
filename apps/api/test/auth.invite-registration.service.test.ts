import { ConflictException, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';

describe('AuthService.registerFromInvite', () => {
  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('jwt-token'),
  };

  const mockPrisma = {
    registrarArtistMember: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (cb: (tx: typeof mockPrisma) => unknown) =>
      cb(mockPrisma as any),
    );
    service = new AuthService(mockUsersService as any, mockJwtService as any, mockPrisma as any);
  });

  it('rejects invalid invite token', async () => {
    mockPrisma.registrarArtistMember.findUnique.mockResolvedValue(null);

    await expect(
      service.registerFromInvite({
        inviteToken: '11111111-1111-1111-1111-111111111111',
        email: 'sam@example.com',
        username: 'sampulse',
        displayName: 'Sam Pulse',
        password: 'password123',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('creates invited user with home-scene defaults and marks claim', async () => {
    mockPrisma.registrarArtistMember.findUnique.mockResolvedValue({
      id: 'ram-1',
      email: 'sam@example.com',
      inviteStatus: 'queued',
      inviteTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
      existingUserId: null,
      claimedUserId: null,
      registrarEntry: {
        scene: {
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'punk',
        },
      },
    });
    mockPrisma.user.create.mockResolvedValue({
      id: 'u-99',
      email: 'sam@example.com',
      username: 'sampulse',
    });
    mockPrisma.registrarArtistMember.update.mockResolvedValue({
      id: 'ram-1',
      claimedUserId: 'u-99',
      inviteStatus: 'claimed',
    });

    const result = await service.registerFromInvite({
      inviteToken: '11111111-1111-1111-1111-111111111111',
      email: 'sam@example.com',
      username: 'sampulse',
      displayName: 'Sam Pulse',
      password: 'password123',
    });

    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'sam@example.com',
          homeSceneCity: 'Austin',
          homeSceneState: 'TX',
          homeSceneCommunity: 'punk',
          gpsVerified: false,
        }),
      }),
    );
    expect(mockPrisma.registrarArtistMember.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ram-1' },
        data: expect.objectContaining({
          claimedUserId: 'u-99',
          inviteStatus: 'claimed',
        }),
      }),
    );
    expect(result.accessToken).toBe('jwt-token');
  });

  it('rejects already claimed invite', async () => {
    mockPrisma.registrarArtistMember.findUnique.mockResolvedValue({
      id: 'ram-2',
      email: 'sam@example.com',
      inviteStatus: 'claimed',
      inviteTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
      existingUserId: null,
      claimedUserId: 'u-1',
      registrarEntry: {
        scene: {
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'punk',
        },
      },
    });

    await expect(
      service.registerFromInvite({
        inviteToken: '11111111-1111-1111-1111-111111111111',
        email: 'sam@example.com',
        username: 'sampulse',
        displayName: 'Sam Pulse',
        password: 'password123',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('previews valid invite context for prefill surfaces', async () => {
    mockPrisma.registrarArtistMember.findUnique.mockResolvedValue({
      id: 'ram-3',
      name: 'Sam Pulse',
      email: 'sam@example.com',
      city: 'Austin',
      instrument: 'Drums',
      inviteStatus: 'queued',
      inviteTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
      existingUserId: null,
      claimedUserId: null,
      registrarEntry: {
        scene: {
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'punk',
        },
      },
    });

    const result = await service.previewInvite({
      inviteToken: '11111111-1111-1111-1111-111111111111',
    });

    expect(result.member.email).toBe('sam@example.com');
    expect(result.scene.musicCommunity).toBe('punk');
  });

  it('rejects preview for claimed invite token', async () => {
    mockPrisma.registrarArtistMember.findUnique.mockResolvedValue({
      id: 'ram-4',
      name: 'Sam Pulse',
      email: 'sam@example.com',
      city: 'Austin',
      instrument: 'Drums',
      inviteStatus: 'claimed',
      inviteTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
      existingUserId: null,
      claimedUserId: 'u-1',
      registrarEntry: {
        scene: {
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'punk',
        },
      },
    });

    await expect(
      service.previewInvite({
        inviteToken: '11111111-1111-1111-1111-111111111111',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
