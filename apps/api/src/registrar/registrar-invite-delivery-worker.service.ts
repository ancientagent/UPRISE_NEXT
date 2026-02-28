import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrarService } from './registrar.service';
import {
  INVITE_DELIVERY_PROVIDER,
  type InviteDeliveryPayload,
  type InviteDeliveryProvider,
} from './invite-delivery.provider';

@Injectable()
export class RegistrarInviteDeliveryWorkerService {
  private readonly logger = new Logger(RegistrarInviteDeliveryWorkerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly registrarService: RegistrarService,
    @Inject(INVITE_DELIVERY_PROVIDER)
    private readonly inviteDeliveryProvider: InviteDeliveryProvider,
  ) {}

  async processQueuedDeliveries(): Promise<{
    queued: number;
    processed: number;
    sent: number;
    failed: number;
    elapsed: number;
  }> {
    const startedAt = Date.now();
    const queuedDeliveries = await this.prisma.registrarInviteDelivery.findMany({
      where: {
        status: 'queued',
      },
      select: {
        id: true,
        registrarArtistMemberId: true,
        email: true,
        payload: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (queuedDeliveries.length === 0) {
      this.logger.log('No queued invite deliveries found');
      return { queued: 0, processed: 0, sent: 0, failed: 0, elapsed: Date.now() - startedAt };
    }

    this.logger.log(`Processing ${queuedDeliveries.length} queued invite deliveries`);

    let sent = 0;
    let failed = 0;
    const finalizedMembers = new Set<string>();

    for (const delivery of queuedDeliveries) {
      const markFinalizedOnce = async (status: 'sent' | 'failed'): Promise<void> => {
        if (finalizedMembers.has(delivery.registrarArtistMemberId)) {
          this.logger.warn(
            `Skipping duplicate finalize attempt for ${delivery.email} (${delivery.registrarArtistMemberId})`,
          );
          return;
        }
        await this.registrarService.finalizeQueuedInviteDelivery(delivery.registrarArtistMemberId, status);
        finalizedMembers.add(delivery.registrarArtistMemberId);
      };

      try {
        const payload = delivery.payload as unknown as InviteDeliveryPayload;
        const status = await this.inviteDeliveryProvider.send(delivery.email, payload, {
          deliveryId: delivery.id,
          registrarArtistMemberId: delivery.registrarArtistMemberId,
        });

        await markFinalizedOnce(status);

        if (status === 'sent') {
          sent += 1;
          this.logger.log(`Successfully sent invite to ${delivery.email}`);
        } else {
          failed += 1;
          this.logger.warn(`Failed to send invite to ${delivery.email}`);
        }
      } catch (error) {
        failed += 1;
        this.logger.error(
          `Error processing invite delivery for ${delivery.email}: ${error instanceof Error ? error.message : String(error)}`,
          error instanceof Error ? error.stack : undefined,
        );

        try {
          await markFinalizedOnce('failed');
        } catch (finalizeError) {
          this.logger.error(
            `Failed to finalize delivery status for ${delivery.email}: ${finalizeError instanceof Error ? finalizeError.message : String(finalizeError)}`,
            finalizeError instanceof Error ? finalizeError.stack : undefined,
          );
        }
      }
    }

    this.logger.log(
      `Processed ${queuedDeliveries.length} deliveries: sent=${sent} failed=${failed}`,
    );

    return {
      queued: queuedDeliveries.length,
      processed: queuedDeliveries.length,
      sent,
      failed,
      elapsed: Date.now() - startedAt,
    };
  }
}
