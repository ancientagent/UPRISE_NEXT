import { api } from '@/lib/api';

export interface MusicCommunityPreference {
  id: string;
  musicCommunity: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getMusicCommunityPreferences(token: string): Promise<MusicCommunityPreference[]> {
  const response = await api.get<MusicCommunityPreference[]>('/users/me/music-community-preferences', { token });
  return response.data ?? [];
}

export async function addMusicCommunityPreference(
  musicCommunity: string,
  token: string,
): Promise<MusicCommunityPreference[]> {
  const response = await api.post<MusicCommunityPreference[]>(
    '/users/me/music-community-preferences',
    { musicCommunity },
    { token },
  );
  return response.data ?? [];
}

export async function setDefaultMusicCommunityPreference(
  musicCommunity: string,
  token: string,
): Promise<MusicCommunityPreference[]> {
  const response = await api.post<MusicCommunityPreference[]>(
    '/users/me/music-community-preferences/default',
    { musicCommunity },
    { token },
  );
  return response.data ?? [];
}
