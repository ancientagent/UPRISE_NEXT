import { RegistrarInviteDeliveryTriggerService } from '../src/registrar/registrar-invite-delivery-trigger.service';

describe('RegistrarInviteDeliveryTriggerService', () => {
  const mockConfigService = {
    get: jest.fn(),
  };

  const mockWorkerService = {
    processQueuedDeliveries: jest.fn(),
  };

  let service: RegistrarInviteDeliveryTriggerService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    service = new RegistrarInviteDeliveryTriggerService(
      mockConfigService as any,
      mockWorkerService as any,
    );
  });

  afterEach(() => {
    service.onModuleDestroy();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('does not start polling when trigger env flag is disabled', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'REGISTRAR_INVITE_DELIVERY_AUTORUN_ENABLED') return 'false';
      return undefined;
    });

    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    service.onModuleInit();

    expect(setIntervalSpy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(60_000);
    await Promise.resolve();
    expect(mockWorkerService.processQueuedDeliveries).not.toHaveBeenCalled();
    setIntervalSpy.mockRestore();
  });

  it('starts polling when enabled and runs worker on interval', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'REGISTRAR_INVITE_DELIVERY_AUTORUN_ENABLED') return 'true';
      if (key === 'REGISTRAR_INVITE_DELIVERY_AUTORUN_INTERVAL_MS') return '6000';
      return undefined;
    });
    mockWorkerService.processQueuedDeliveries.mockResolvedValue({
      queued: 1,
      processed: 1,
      sent: 1,
      failed: 0,
      elapsed: 5,
    });

    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    service.onModuleInit();

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 6000);
    jest.advanceTimersByTime(6000);
    await Promise.resolve();
    expect(mockWorkerService.processQueuedDeliveries).toHaveBeenCalledTimes(1);
    setIntervalSpy.mockRestore();
  });

  it('clamps interval to minimum safety floor when configured below minimum', () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'REGISTRAR_INVITE_DELIVERY_AUTORUN_ENABLED') return '1';
      if (key === 'REGISTRAR_INVITE_DELIVERY_AUTORUN_INTERVAL_MS') return '1000';
      return undefined;
    });

    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    service.onModuleInit();

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
    setIntervalSpy.mockRestore();
  });

  it('prevents overlapping runs while a prior tick is still active', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'REGISTRAR_INVITE_DELIVERY_AUTORUN_ENABLED') return 'true';
      if (key === 'REGISTRAR_INVITE_DELIVERY_AUTORUN_INTERVAL_MS') return '5000';
      return undefined;
    });

    let resolveWorker:
      | ((value: { queued: number; processed: number; sent: number; failed: number; elapsed: number }) => void)
      | null =
      null;
    const activePromise = new Promise<{
      queued: number;
      processed: number;
      sent: number;
      failed: number;
      elapsed: number;
    }>((resolve) => {
      resolveWorker = resolve;
    });
    mockWorkerService.processQueuedDeliveries.mockReturnValue(activePromise);

    service.onModuleInit();

    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    expect(mockWorkerService.processQueuedDeliveries).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    expect(mockWorkerService.processQueuedDeliveries).toHaveBeenCalledTimes(1);

    resolveWorker?.({ queued: 0, processed: 0, sent: 0, failed: 0, elapsed: 1 });
    await Promise.resolve();

    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    expect(mockWorkerService.processQueuedDeliveries).toHaveBeenCalledTimes(2);
  });
});
