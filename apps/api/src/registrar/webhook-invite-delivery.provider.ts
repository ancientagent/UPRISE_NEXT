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
  private static readonly DEFAULT_TIMEOUT_MS = 10_000;
  private static readonly MIN_TIMEOUT_MS = 1_000;

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
    const timeoutMs = this.resolveTimeoutMs();
    const abortController = new AbortController();
    const timeoutHandle = setTimeout(() => {
      abortController.abort();
    }, timeoutMs);

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
        signal: abortController.signal,
      });

      clearTimeout(timeoutHandle);

      if (!response.ok) {
        this.logger.warn(`Webhook invite delivery failed: status=${response.status}`);
        return 'failed';
      }

      return 'sent';
    } catch (error) {
      clearTimeout(timeoutHandle);
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

  private resolveTimeoutMs(): number {
    const rawTimeout = this.configService.get<string>('REGISTRAR_INVITE_DELIVERY_WEBHOOK_TIMEOUT_MS');
    if (!rawTimeout) {
      return WebhookInviteDeliveryProvider.DEFAULT_TIMEOUT_MS;
    }

    const parsed = Number.parseInt(rawTimeout, 10);
    if (!Number.isFinite(parsed)) {
      return WebhookInviteDeliveryProvider.DEFAULT_TIMEOUT_MS;
    }

    return Math.max(parsed, WebhookInviteDeliveryProvider.MIN_TIMEOUT_MS);
  }
}
