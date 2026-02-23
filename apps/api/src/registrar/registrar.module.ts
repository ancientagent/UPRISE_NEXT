import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegistrarController } from './registrar.controller';
import { RegistrarService } from './registrar.service';
import { NoopInviteDeliveryProvider } from './noop-invite-delivery.provider';
import { RegistrarInviteDeliveryWorkerService } from './registrar-invite-delivery-worker.service';
import { RegistrarInviteDeliveryTriggerService } from './registrar-invite-delivery-trigger.service';
import { INVITE_DELIVERY_PROVIDER } from './invite-delivery.provider';
import { WebhookInviteDeliveryProvider } from './webhook-invite-delivery.provider';
import { resolveInviteDeliveryProviderKind } from './invite-delivery-provider-selector';

@Module({
  controllers: [RegistrarController],
  providers: [
    RegistrarService,
    NoopInviteDeliveryProvider,
    WebhookInviteDeliveryProvider,
    {
      provide: INVITE_DELIVERY_PROVIDER,
      inject: [ConfigService, NoopInviteDeliveryProvider, WebhookInviteDeliveryProvider],
      useFactory: (
        configService: ConfigService,
        noopProvider: NoopInviteDeliveryProvider,
        webhookProvider: WebhookInviteDeliveryProvider,
      ) => {
        const providerKind = resolveInviteDeliveryProviderKind(
          configService.get<string>('REGISTRAR_INVITE_DELIVERY_PROVIDER'),
        );
        if (providerKind === 'webhook') {
          return webhookProvider;
        }
        return noopProvider;
      },
    },
    RegistrarInviteDeliveryWorkerService,
    RegistrarInviteDeliveryTriggerService,
  ],
  exports: [RegistrarService, RegistrarInviteDeliveryWorkerService, RegistrarInviteDeliveryTriggerService],
})
export class RegistrarModule {}
