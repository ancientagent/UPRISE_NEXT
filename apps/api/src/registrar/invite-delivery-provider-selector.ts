export type InviteDeliveryProviderKind = 'noop' | 'webhook';

export function resolveInviteDeliveryProviderKind(
  rawValue: string | undefined,
): InviteDeliveryProviderKind {
  if (!rawValue) return 'noop';
  const value = rawValue.trim().toLowerCase();
  if (value === 'webhook') return 'webhook';
  return 'noop';
}
