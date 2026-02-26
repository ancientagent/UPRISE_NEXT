import { resolveInviteDeliveryProviderKind } from '../src/registrar/invite-delivery-provider-selector';

describe('resolveInviteDeliveryProviderKind', () => {
  it('defaults to noop when value is missing', () => {
    expect(resolveInviteDeliveryProviderKind(undefined)).toBe('noop');
  });

  it('returns webhook when configured as webhook', () => {
    expect(resolveInviteDeliveryProviderKind('webhook')).toBe('webhook');
    expect(resolveInviteDeliveryProviderKind(' WEBHOOK ')).toBe('webhook');
  });

  it('falls back to noop for unknown values', () => {
    expect(resolveInviteDeliveryProviderKind('smtp')).toBe('noop');
    expect(resolveInviteDeliveryProviderKind('anything-else')).toBe('noop');
  });
});
