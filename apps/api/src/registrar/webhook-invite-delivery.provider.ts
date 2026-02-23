import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  InviteDeliveryContext,
  InviteDeliveryPayload,
  InviteDeliveryProvider,
} from './invite-delivery.provider';

@Injectable()
export class WebhookInviteDeliveryProvider implements InviteDeliveryProvider {
  private readonly logger = new Logger(WebhookInviteDeliveryProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async send(
    email: string,
    payload: InviteDeliveryPayload,
    context: InviteDeliveryContext,
  ): Promise<'sent' | 'failed'> {
    const webhookUrl = this.resolveWebhookUrl();
    if (!webhookUrl) {
      this.logger.error(
        'Missing/invalid REGISTRAR_INVITE_DELIVERY_WEBHOOK_URL for webhook provider',
      );
      return 'failed';
    }

    const webhookToken = this.configService.get<string>('REGISTRAR_INVITE_DELIVERY_WEBHOOK_TOKEN');

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
        },
        body: JSON.stringify({
          type: 'registrar_invite_delivery',
          email,
          payload,
          context,
        }),
      });

      if (!response.ok) {
        this.logger.warn(`Webhook invite delivery failed: status=${response.status}`);
        return 'failed';
      }

      return 'sent';
    } catch (error) {
      this.logger.error(
        `Webhook invite delivery error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return 'failed';
    }
  }

  private resolveWebhookUrl(): string | null {
    const rawWebhookUrl = this.configService.get<string>('REGISTRAR_INVITE_DELIVERY_WEBHOOK_URL');
    if (!rawWebhookUrl) {
      return null;
    }

    try {
      const parsed = new URL(rawWebhookUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return null;
      }
      return parsed.toString();
    } catch {
      return null;
    }
  }
}
