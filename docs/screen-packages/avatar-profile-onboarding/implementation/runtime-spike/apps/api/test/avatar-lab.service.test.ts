import { ConfigService } from '@nestjs/config';
import { ServiceUnavailableException } from '@nestjs/common';
import { AvatarLabService } from '../src/avatar-lab/avatar-lab.service';

describe('AvatarLabService', () => {
  const capturedPhoto = `data:image/jpeg;base64,${Buffer.from('camera-frame').toString('base64')}`;
  const avatar = `data:image/png;base64,${Buffer.from('avatar-render').toString('base64')}`;
  const prisma = {
    $transaction: jest.fn(),
  } as any;

  it('requires the server-side image provider configuration', async () => {
    const service = new AvatarLabService({ get: () => undefined } as ConfigService, prisma);

    await expect(
      service.generateCandidates({
        capturedPhoto,
        musicCommunity: 'Punk',
        likenessConsent: true,
      }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('returns data URLs from image candidates', async () => {
    const service = new AvatarLabService({
      get: (key: string) => key === 'OPENAI_API_KEY' ? 'test-key' : undefined,
    } as ConfigService, prisma);
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: [{ b64_json: 'first' }, { b64_json: 'second' }] }), {
        status: 200,
      }),
    );

    await expect(
      service.generateCandidates({
        capturedPhoto,
        musicCommunity: 'Punk',
        likenessConsent: true,
      }),
    ).resolves.toEqual({
      candidates: ['data:image/png;base64,first', 'data:image/png;base64,second'],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/images/edits',
      expect.objectContaining({ method: 'POST', headers: { Authorization: 'Bearer test-key' } }),
    );
    const requestBody = fetchMock.mock.calls[0]?.[1]?.body as FormData;
    expect(requestBody.getAll('image[]')).toHaveLength(2);
    expect(requestBody.get('prompt')).toEqual(expect.stringContaining(
      'individual geometry into the same character construction',
    ));
    expect(requestBody.get('prompt')).toEqual(expect.stringContaining(
      'Ignore the clothing visible in the camera image',
    ));
    expect(requestBody.get('prompt')).toEqual(expect.stringContaining(
      'predefined wardrobe assets can align later',
    ));
    expect(requestBody.get('prompt')).toEqual(expect.stringContaining(
      'standardized open black denim vest',
    ));
    fetchMock.mockRestore();
  });

  it('persists only the selected illustrated identity and starter configuration', async () => {
    const avatarProfile = {
      upsert: jest.fn().mockResolvedValue({
        id: 'avatar-profile-1',
        musicCommunity: 'Punk',
        starterTopId: 'uprise-tee-black',
      }),
    };
    const user = {
      update: jest.fn().mockResolvedValue({
        id: 'user-1',
        username: 'listener',
        displayName: 'Listener',
        bio: null,
        avatar,
      }),
    };
    prisma.$transaction.mockImplementation(async (work: (tx: { avatarProfile: typeof avatarProfile; user: typeof user }) => unknown) =>
      work({ avatarProfile, user }),
    );
    const service = new AvatarLabService({ get: () => undefined } as ConfigService, prisma);

    await expect(service.saveSelection('user-1', {
      avatar,
      musicCommunity: 'Punk',
      likenessConsent: true,
    })).resolves.toEqual({
      id: 'user-1',
      username: 'listener',
      displayName: 'Listener',
      bio: null,
      avatar,
      avatarProfile: {
        id: 'avatar-profile-1',
        musicCommunity: 'Punk',
        starterTopId: 'uprise-tee-black',
      },
    });

    expect(avatarProfile.upsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({
        userId: 'user-1',
        identityRender: avatar,
        starterTopId: 'uprise-tee-black',
        configuration: expect.objectContaining({
          identitySource: 'camera-likeness',
          wardrobe: {
            topId: 'uprise-tee-black',
            outerwearId: 'outerwear-open-denim-vest-black',
          },
        }),
      }),
    }));
    expect(user.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ avatar }),
    }));
  });
});
