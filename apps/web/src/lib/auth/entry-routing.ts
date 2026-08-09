import { api } from '@/lib/api';

export type AccountEntryStatus = {
  homeSceneCity: string | null;
  homeSceneState: string | null;
  homeSceneCommunity: string | null;
  hasCompleteHomeScene: boolean;
};

export function resolveAccountEntryDestination(
  status: AccountEntryStatus,
): '/onboarding' | '/plot' {
  return status.hasCompleteHomeScene ? '/plot' : '/onboarding';
}

export async function loadAccountEntryDestination(token: string) {
  const response = await api.get<AccountEntryStatus>('/users/me/entry-status', { token });
  if (!response.data) {
    throw new Error('Account entry status could not be loaded.');
  }

  return resolveAccountEntryDestination(response.data);
}
