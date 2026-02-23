export type InviteDeliveryProviderKind = 'noop' | 'webhook';

export function resolveInviteDeliveryProviderKind(
  rawValue: string | undefined,
): InviteDeliveryProviderKind {
  if (!rawValue) return 'noop';
  const value = rawValue.trim().toLowerCase();
  if (value === 'webhook') return 'webhook';
  return 'noop';
}

export function selectInviteDeliveryProvider<T>(
  rawValue: string | undefined,
  providers: {
    noop: T;
    webhook: T;
  },
): T {
  const kind = resolveInviteDeliveryProviderKind(rawValue);
  return kind === 'webhook' ? providers.webhook : providers.noop;
}
