export const INVITE_DELIVERY_PROVIDER = 'InviteDeliveryProvider';

export interface InviteDeliveryPayload {
  inviteToken: string;
  mobileAppUrl: string;
  webAppUrl: string;
  memberName: string;
  memberCity: string;
  sceneCity: string;
  sceneState: string;
  musicCommunity: string;
}

export interface InviteDeliveryProvider {
  send(email: string, payload: InviteDeliveryPayload): Promise<'sent' | 'failed'>;
}
