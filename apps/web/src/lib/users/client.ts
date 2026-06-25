import { api } from '@/lib/api';

export interface MusicCommunityPreference {
  id: string;
  musicCommunity: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomeSceneRollerItem {
  preferenceId: string;
  musicCommunity: string;
  isDefault: boolean;
  sceneId: string;
  sceneName: string;
  city: string | null;
  state: string | null;
  resolution: 'natural' | 'proxy';
  isCurrent: boolean;
}

export interface HomeSceneRoller {
  currentLocation: { city: string; state: string } | null;
  items: HomeSceneRollerItem[];
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

export async function getHomeSceneRoller(token: string): Promise<HomeSceneRoller> {
  const response = await api.get<HomeSceneRoller>('/users/me/home-scene-roller', { token });
  return response.data ?? { currentLocation: null, items: [] };
}
