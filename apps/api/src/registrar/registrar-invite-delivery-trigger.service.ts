import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegistrarInviteDeliveryWorkerService } from './registrar-invite-delivery-worker.service';

const DEFAULT_INTERVAL_MS = 60_000;
const MIN_INTERVAL_MS = 5_000;

@Injectable()
export class RegistrarInviteDeliveryTriggerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RegistrarInviteDeliveryTriggerService.name);
  private intervalHandle: NodeJS.Timeout | null = null;
  private running = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly workerService: RegistrarInviteDeliveryWorkerService,
  ) {}

  onModuleInit(): void {
    const isEnabled = this.parseEnabledFlag(
      this.configService.get<string>('REGISTRAR_INVITE_DELIVERY_AUTORUN_ENABLED'),
    );

    if (!isEnabled) {
      this.logger.log('Invite delivery trigger disabled (REGISTRAR_INVITE_DELIVERY_AUTORUN_ENABLED)');
      return;
    }

    const intervalMs = this.resolveIntervalMs();
    this.intervalHandle = setInterval(() => {
      void this.tick();
    }, intervalMs);

    this.logger.log(`Invite delivery trigger enabled; polling every ${intervalMs}ms`);
  }

  onModuleDestroy(): void {
    if (!this.intervalHandle) {
      return;
    }

    clearInterval(this.intervalHandle);
    this.intervalHandle = null;
    this.logger.log('Invite delivery trigger stopped');
  }

  private parseEnabledFlag(value: string | undefined): boolean {
    if (!value) return false;
    return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
  }

  private resolveIntervalMs(): number {
    const rawInterval = this.configService.get<string>('REGISTRAR_INVITE_DELIVERY_AUTORUN_INTERVAL_MS');
    if (!rawInterval) {
      return DEFAULT_INTERVAL_MS;
    }

    const parsed = Number.parseInt(rawInterval, 10);
    if (!Number.isFinite(parsed)) {
      return DEFAULT_INTERVAL_MS;
    }

    return Math.max(parsed, MIN_INTERVAL_MS);
  }

  private async tick(): Promise<void> {
    if (this.running) {
      this.logger.warn('Invite delivery trigger skipped tick; previous run still active');
      return;
    }

    this.running = true;
    try {
      const result = await this.workerService.processQueuedDeliveries();
      this.logger.log(
        `Invite delivery trigger tick complete: processed=${result.processed} succeeded=${result.succeeded} failed=${result.failed}`,
      );
    } catch (error) {
      this.logger.error(
        `Invite delivery trigger tick failed: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
    } finally {
      this.running = false;
    }
  }
}
