import { Module } from '@nestjs/common';
import { RegistrarController } from './registrar.controller';
import { RegistrarService } from './registrar.service';
import { NoopInviteDeliveryProvider } from './noop-invite-delivery.provider';
import { RegistrarInviteDeliveryWorkerService } from './registrar-invite-delivery-worker.service';
import { RegistrarInviteDeliveryTriggerService } from './registrar-invite-delivery-trigger.service';
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
    RegistrarInviteDeliveryTriggerService,
  ],
  exports: [RegistrarService, RegistrarInviteDeliveryWorkerService, RegistrarInviteDeliveryTriggerService],
})
export class RegistrarModule {}
