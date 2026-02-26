import { selectInviteDeliveryProvider } from '../src/registrar/invite-delivery-provider-selector';

describe('RegistrarModule invite provider selection', () => {
  const noopProvider = { name: 'noop-provider' };
  const webhookProvider = { name: 'webhook-provider' };

  it('selects noop provider by default', () => {
    const selected = selectInviteDeliveryProvider(undefined, {
      noop: noopProvider,
      webhook: webhookProvider,
    });
    expect(selected).toBe(noopProvider);
  });

  it('selects webhook provider when configured', () => {
    const selected = selectInviteDeliveryProvider('webhook', {
      noop: noopProvider,
      webhook: webhookProvider,
    });
    expect(selected).toBe(webhookProvider);
  });

  it('falls back to noop provider for unknown values', () => {
    const selected = selectInviteDeliveryProvider('smtp', {
      noop: noopProvider,
      webhook: webhookProvider,
    });
    expect(selected).toBe(noopProvider);
  });
});
