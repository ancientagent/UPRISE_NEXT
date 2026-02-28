import { RegistrarInviteDeliveryWorkerService } from '../src/registrar/registrar-invite-delivery-worker.service';
import type { InviteDeliveryProvider } from '../src/registrar/invite-delivery.provider';

describe('RegistrarInviteDeliveryWorkerService', () => {
  const mockPrisma = {
    registrarInviteDelivery: {
      findMany: jest.fn(),
    },
  };

  const mockRegistrarService = {
    finalizeQueuedInviteDelivery: jest.fn(),
  };

  const mockInviteDeliveryProvider: InviteDeliveryProvider = {
    send: jest.fn(),
  };

  let service: RegistrarInviteDeliveryWorkerService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RegistrarInviteDeliveryWorkerService(
      mockPrisma as any,
      mockRegistrarService as any,
      mockInviteDeliveryProvider,
    );
  });

  describe('processQueuedDeliveries', () => {
    it('returns zero counts when no queued deliveries exist', async () => {
      mockPrisma.registrarInviteDelivery.findMany.mockResolvedValue([]);

      const result = await service.processQueuedDeliveries();

      expect(result).toMatchObject({
        queued: 0,
        processed: 0,
        sent: 0,
        failed: 0,
      });
      expect(result.elapsed).toEqual(expect.any(Number));
      expect(mockPrisma.registrarInviteDelivery.findMany).toHaveBeenCalledWith({
        where: { status: 'queued' },
        select: {
          id: expect.any(Boolean),
          registrarArtistMemberId: expect.any(Boolean),
          email: expect.any(Boolean),
          payload: expect.any(Boolean),
        },
        orderBy: { createdAt: 'asc' },
      });
      expect(mockInviteDeliveryProvider.send).not.toHaveBeenCalled();
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).not.toHaveBeenCalled();
    });

    it('processes queued deliveries successfully when provider returns sent', async () => {
      const queuedDeliveries = [
        {
          id: 'delivery-1',
          registrarArtistMemberId: 'member-1',
          email: 'artist1@example.com',
          payload: {
            inviteToken: 'token-1',
            mobileAppUrl: 'https://mobile.app/invite/token-1',
            webAppUrl: 'https://web.app/invite/token-1',
            memberName: 'Artist One',
            memberCity: 'Austin',
            sceneCity: 'Austin',
            sceneState: 'TX',
            musicCommunity: 'indie',
          },
        },
        {
          id: 'delivery-2',
          registrarArtistMemberId: 'member-2',
          email: 'artist2@example.com',
          payload: {
            inviteToken: 'token-2',
            mobileAppUrl: 'https://mobile.app/invite/token-2',
            webAppUrl: 'https://web.app/invite/token-2',
            memberName: 'Artist Two',
            memberCity: 'Austin',
            sceneCity: 'Austin',
            sceneState: 'TX',
            musicCommunity: 'indie',
          },
        },
      ];

      mockPrisma.registrarInviteDelivery.findMany.mockResolvedValue(queuedDeliveries);
      (mockInviteDeliveryProvider.send as jest.Mock).mockResolvedValue('sent');

      const result = await service.processQueuedDeliveries();

      expect(result).toMatchObject({
        queued: 2,
        processed: 2,
        sent: 2,
        failed: 0,
      });
      expect(result.elapsed).toEqual(expect.any(Number));
      expect(mockInviteDeliveryProvider.send).toHaveBeenCalledTimes(2);
      expect(mockInviteDeliveryProvider.send).toHaveBeenCalledWith(
        'artist1@example.com',
        queuedDeliveries[0].payload,
        { deliveryId: 'delivery-1', registrarArtistMemberId: 'member-1' },
      );
      expect(mockInviteDeliveryProvider.send).toHaveBeenCalledWith(
        'artist2@example.com',
        queuedDeliveries[1].payload,
        { deliveryId: 'delivery-2', registrarArtistMemberId: 'member-2' },
      );
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledTimes(2);
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledWith('member-1', 'sent');
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledWith('member-2', 'sent');
    });

    it('processes deliveries and marks as failed when provider returns failed', async () => {
      const queuedDeliveries = [
        {
          id: 'delivery-1',
          registrarArtistMemberId: 'member-1',
          email: 'artist1@example.com',
          payload: {
            inviteToken: 'token-1',
            mobileAppUrl: 'https://mobile.app/invite/token-1',
            webAppUrl: 'https://web.app/invite/token-1',
            memberName: 'Artist One',
            memberCity: 'Austin',
            sceneCity: 'Austin',
            sceneState: 'TX',
            musicCommunity: 'indie',
          },
        },
      ];

      mockPrisma.registrarInviteDelivery.findMany.mockResolvedValue(queuedDeliveries);
      (mockInviteDeliveryProvider.send as jest.Mock).mockResolvedValue('failed');

      const result = await service.processQueuedDeliveries();

      expect(result).toMatchObject({
        queued: 1,
        processed: 1,
        sent: 0,
        failed: 1,
      });
      expect(result.elapsed).toEqual(expect.any(Number));
      expect(mockInviteDeliveryProvider.send).toHaveBeenCalledTimes(1);
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledWith('member-1', 'failed');
    });

    it('handles mixed success and failure results', async () => {
      const queuedDeliveries = [
        {
          id: 'delivery-1',
          registrarArtistMemberId: 'member-1',
          email: 'success@example.com',
          payload: {
            inviteToken: 'token-1',
            mobileAppUrl: 'https://mobile.app/invite/token-1',
            webAppUrl: 'https://web.app/invite/token-1',
            memberName: 'Success Artist',
            memberCity: 'Austin',
            sceneCity: 'Austin',
            sceneState: 'TX',
            musicCommunity: 'indie',
          },
        },
        {
          id: 'delivery-2',
          registrarArtistMemberId: 'member-2',
          email: 'failed@example.com',
          payload: {
            inviteToken: 'token-2',
            mobileAppUrl: 'https://mobile.app/invite/token-2',
            webAppUrl: 'https://web.app/invite/token-2',
            memberName: 'Failed Artist',
            memberCity: 'Austin',
            sceneCity: 'Austin',
            sceneState: 'TX',
            musicCommunity: 'indie',
          },
        },
      ];

      mockPrisma.registrarInviteDelivery.findMany.mockResolvedValue(queuedDeliveries);
      (mockInviteDeliveryProvider.send as jest.Mock)
        .mockResolvedValueOnce('sent')
        .mockResolvedValueOnce('failed');

      const result = await service.processQueuedDeliveries();

      expect(result).toMatchObject({
        queued: 2,
        processed: 2,
        sent: 1,
        failed: 1,
      });
      expect(result.elapsed).toEqual(expect.any(Number));
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledWith('member-1', 'sent');
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledWith('member-2', 'failed');
    });

    it('handles provider exceptions and marks delivery as failed', async () => {
      const queuedDeliveries = [
        {
          id: 'delivery-1',
          registrarArtistMemberId: 'member-1',
          email: 'error@example.com',
          payload: {
            inviteToken: 'token-1',
            mobileAppUrl: 'https://mobile.app/invite/token-1',
            webAppUrl: 'https://web.app/invite/token-1',
            memberName: 'Error Artist',
            memberCity: 'Austin',
            sceneCity: 'Austin',
            sceneState: 'TX',
            musicCommunity: 'indie',
          },
        },
      ];

      mockPrisma.registrarInviteDelivery.findMany.mockResolvedValue(queuedDeliveries);
      (mockInviteDeliveryProvider.send as jest.Mock).mockRejectedValue(
        new Error('Network timeout'),
      );

      const result = await service.processQueuedDeliveries();

      expect(result).toMatchObject({
        queued: 1,
        processed: 1,
        sent: 0,
        failed: 1,
      });
      expect(result.elapsed).toEqual(expect.any(Number));
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledWith('member-1', 'failed');
    });

    it('continues processing remaining deliveries when one fails', async () => {
      const queuedDeliveries = [
        {
          id: 'delivery-1',
          registrarArtistMemberId: 'member-1',
          email: 'error@example.com',
          payload: {
            inviteToken: 'token-1',
            mobileAppUrl: 'https://mobile.app/invite/token-1',
            webAppUrl: 'https://web.app/invite/token-1',
            memberName: 'Error Artist',
            memberCity: 'Austin',
            sceneCity: 'Austin',
            sceneState: 'TX',
            musicCommunity: 'indie',
          },
        },
        {
          id: 'delivery-2',
          registrarArtistMemberId: 'member-2',
          email: 'success@example.com',
          payload: {
            inviteToken: 'token-2',
            mobileAppUrl: 'https://mobile.app/invite/token-2',
            webAppUrl: 'https://web.app/invite/token-2',
            memberName: 'Success Artist',
            memberCity: 'Austin',
            sceneCity: 'Austin',
            sceneState: 'TX',
            musicCommunity: 'indie',
          },
        },
      ];

      mockPrisma.registrarInviteDelivery.findMany.mockResolvedValue(queuedDeliveries);
      (mockInviteDeliveryProvider.send as jest.Mock)
        .mockRejectedValueOnce(new Error('Network timeout'))
        .mockResolvedValueOnce('sent');

      const result = await service.processQueuedDeliveries();

      expect(result).toMatchObject({
        queued: 2,
        processed: 2,
        sent: 1,
        failed: 1,
      });
      expect(result.elapsed).toEqual(expect.any(Number));
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledTimes(2);
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledWith('member-1', 'failed');
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledWith('member-2', 'sent');
    });

    it('handles finalize failure gracefully and continues processing', async () => {
      const queuedDeliveries = [
        {
          id: 'delivery-1',
          registrarArtistMemberId: 'member-1',
          email: 'artist@example.com',
          payload: {
            inviteToken: 'token-1',
            mobileAppUrl: 'https://mobile.app/invite/token-1',
            webAppUrl: 'https://web.app/invite/token-1',
            memberName: 'Artist',
            memberCity: 'Austin',
            sceneCity: 'Austin',
            sceneState: 'TX',
            musicCommunity: 'indie',
          },
        },
      ];

      mockPrisma.registrarInviteDelivery.findMany.mockResolvedValue(queuedDeliveries);
      (mockInviteDeliveryProvider.send as jest.Mock).mockRejectedValue(
        new Error('Provider error'),
      );
      mockRegistrarService.finalizeQueuedInviteDelivery.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.processQueuedDeliveries();

      expect(result).toMatchObject({
        queued: 1,
        processed: 1,
        sent: 0,
        failed: 1,
      });
      expect(result.elapsed).toEqual(expect.any(Number));
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledWith('member-1', 'failed');
    });

    it('attempts failed fallback finalize when sent finalize throws', async () => {
      const queuedDeliveries = [
        {
          id: 'delivery-1',
          registrarArtistMemberId: 'member-1',
          email: 'artist@example.com',
          payload: {
            inviteToken: 'token-1',
            mobileAppUrl: 'https://mobile.app/invite/token-1',
            webAppUrl: 'https://web.app/invite/token-1',
            memberName: 'Artist',
            memberCity: 'Austin',
            sceneCity: 'Austin',
            sceneState: 'TX',
            musicCommunity: 'indie',
          },
        },
      ];

      mockPrisma.registrarInviteDelivery.findMany.mockResolvedValue(queuedDeliveries);
      (mockInviteDeliveryProvider.send as jest.Mock).mockResolvedValue('sent');
      mockRegistrarService.finalizeQueuedInviteDelivery.mockRejectedValue(
        new Error('Finalize conflict'),
      );

      const result = await service.processQueuedDeliveries();

      expect(result).toMatchObject({
        queued: 1,
        processed: 1,
        sent: 0,
        failed: 1,
      });
      expect(result.elapsed).toEqual(expect.any(Number));
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledTimes(2);
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledWith('member-1', 'sent');
      expect(mockRegistrarService.finalizeQueuedInviteDelivery).toHaveBeenCalledWith('member-1', 'failed');
    });
  });
});
