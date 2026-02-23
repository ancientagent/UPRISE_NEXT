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

  async processQueuedDeliveries(): Promise<{ processed: number; succeeded: number; failed: number }> {
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
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    this.logger.log(`Processing ${queuedDeliveries.length} queued invite deliveries`);

    let succeeded = 0;
    let failed = 0;

    for (const delivery of queuedDeliveries) {
      try {
        const payload = delivery.payload as unknown as InviteDeliveryPayload;
        const status = await this.inviteDeliveryProvider.send(delivery.email, payload);

        await this.registrarService.finalizeQueuedInviteDelivery(
          delivery.registrarArtistMemberId,
          status,
        );

        if (status === 'sent') {
          succeeded += 1;
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
          await this.registrarService.finalizeQueuedInviteDelivery(
            delivery.registrarArtistMemberId,
            'failed',
          );
        } catch (finalizeError) {
          this.logger.error(
            `Failed to finalize delivery status for ${delivery.email}: ${finalizeError instanceof Error ? finalizeError.message : String(finalizeError)}`,
            finalizeError instanceof Error ? finalizeError.stack : undefined,
          );
        }
      }
    }

    this.logger.log(
      `Processed ${queuedDeliveries.length} deliveries: ${succeeded} succeeded, ${failed} failed`,
    );

    return { processed: queuedDeliveries.length, succeeded, failed };
  }
}
