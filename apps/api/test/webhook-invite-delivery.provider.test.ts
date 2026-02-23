import { WebhookInviteDeliveryProvider } from '../src/registrar/webhook-invite-delivery.provider';

describe('WebhookInviteDeliveryProvider', () => {
  const payload = {
    inviteToken: 'token-1',
    mobileAppUrl: 'https://m.uprise.example/download',
    webAppUrl: 'https://uprise.example/band',
    memberName: 'Sam Pulse',
    memberCity: 'Austin',
    sceneCity: 'Austin',
    sceneState: 'TX',
    musicCommunity: 'punk',
  };
  const context = {
    deliveryId: 'delivery-1',
    registrarArtistMemberId: 'member-1',
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  let provider: WebhookInviteDeliveryProvider;
  let fetchSpy: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new WebhookInviteDeliveryProvider(mockConfigService as any);
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('returns failed when webhook URL is missing', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'REGISTRAR_INVITE_DELIVERY_WEBHOOK_URL') return undefined;
      return undefined;
    });

    await expect(provider.send('sam@example.com', payload, context)).resolves.toBe('failed');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns sent on successful webhook response', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'REGISTRAR_INVITE_DELIVERY_WEBHOOK_URL') return 'https://hooks.example/invite';
      if (key === 'REGISTRAR_INVITE_DELIVERY_WEBHOOK_TOKEN') return 'secret-token';
      return undefined;
    });
    fetchSpy.mockResolvedValue({
      ok: true,
      status: 200,
    } as Response);

    await expect(provider.send('sam@example.com', payload, context)).resolves.toBe('sent');
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://hooks.example/invite',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer secret-token',
        }),
        body: JSON.stringify({
          type: 'registrar_invite_delivery',
          email: 'sam@example.com',
          payload,
          context,
        }),
      }),
    );
  });

  it('returns failed when webhook response is non-2xx', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'REGISTRAR_INVITE_DELIVERY_WEBHOOK_URL') return 'https://hooks.example/invite';
      return undefined;
    });
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(provider.send('sam@example.com', payload, context)).resolves.toBe('failed');
  });

  it('returns failed when fetch throws', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'REGISTRAR_INVITE_DELIVERY_WEBHOOK_URL') return 'https://hooks.example/invite';
      return undefined;
    });
    fetchSpy.mockRejectedValue(new Error('network down'));

    await expect(provider.send('sam@example.com', payload, context)).resolves.toBe('failed');
  });
});
