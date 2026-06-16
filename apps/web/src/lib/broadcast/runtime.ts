import type { BroadcastTier } from '@uprise/types';

export function normalizeBroadcastRuntimeError(message: string, tier: BroadcastTier): {
  treatAsEmptyState: boolean;
  userMessage: string;
} {
  if (
    tier === 'state' &&
    message === 'State scene not found for the active community context'
  ) {
    return {
      treatAsEmptyState: true,
      userMessage: 'No state scene is active for this community yet.',
    };
  }

  return {
    treatAsEmptyState: false,
    userMessage: message,
  };
}
