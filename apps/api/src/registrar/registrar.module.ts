import { Module } from '@nestjs/common';
import { RegistrarController } from './registrar.controller';
import { RegistrarService } from './registrar.service';
import { NoopInviteDeliveryProvider } from './noop-invite-delivery.provider';
import { RegistrarInviteDeliveryWorkerService } from './registrar-invite-delivery-worker.service';
import { INVITE_DELIVERY_PROVIDER } from './invite-delivery.provider';

@Module({
  controllers: [RegistrarController],
  providers: [
    RegistrarService,
    {
      provide: INVITE_DELIVERY_PROVIDER,
      useClass: NoopInviteDeliveryProvider,
    },
    RegistrarInviteDeliveryWorkerService,
  ],
  exports: [RegistrarService, RegistrarInviteDeliveryWorkerService],
})
export class RegistrarModule {}
