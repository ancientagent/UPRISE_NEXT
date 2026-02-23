import { Injectable } from '@nestjs/common';
import type {
  InviteDeliveryContext,
  InviteDeliveryPayload,
  InviteDeliveryProvider,
} from './invite-delivery.provider';

@Injectable()
export class NoopInviteDeliveryProvider implements InviteDeliveryProvider {
  async send(
    _email: string,
    _payload: InviteDeliveryPayload,
    _context: InviteDeliveryContext,
  ): Promise<'sent' | 'failed'> {
    return 'sent';
  }
}
