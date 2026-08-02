import type { User } from '@uprise/types';

export function resolveAccountEntryDestination(user: User): '/onboarding' | '/plot' {
  const hasCompleteHomeScene = Boolean(
    user.homeSceneCity?.trim()
      && user.homeSceneState?.trim()
      && user.homeSceneCommunity?.trim(),
  );

  return hasCompleteHomeScene ? '/plot' : '/onboarding';
}
