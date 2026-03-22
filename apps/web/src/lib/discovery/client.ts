import { api } from '@/lib/api';

export type TierScope = 'city' | 'state' | 'national';

export interface DiscoveryScene {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  musicCommunity: string | null;
  tier: string;
  isActive: boolean;
}

export interface DiscoveryContext {
  tunedSceneId: string | null;
  tunedScene: DiscoveryScene | null;
  homeSceneId: string | null;
  isVisitor: boolean;
}

export interface DiscoverCitySceneItem {
  entryType: 'city_scene';
  sceneId: string;
  name: string;
  city: string | null;
  state: string | null;
  musicCommunity: string | null;
  memberCount: number;
  isActive: boolean;
  isHomeScene: boolean;
}

export interface DiscoverStateRollupItem {
  entryType: 'state_rollup';
  state: string;
  musicCommunity: string;
  citySceneCount: number;
  totalMembers: number;
  representativeSceneId: string | null;
  isHomeSceneState: boolean;
}

export type DiscoverItem = DiscoverCitySceneItem | DiscoverStateRollupItem;

export interface DiscoverScenesParams {
  tier: TierScope;
  musicCommunity: string;
  state?: string;
  city?: string;
}

export async function getDiscoveryContext(token: string): Promise<DiscoveryContext | null> {
  const response = await api.get<DiscoveryContext>('/discover/context', { token });
  return response.data ?? null;
}

export async function listDiscoverScenes(
  params: DiscoverScenesParams,
  token?: string,
): Promise<DiscoverItem[]> {
  const query = new URLSearchParams({
    tier: params.tier,
    musicCommunity: params.musicCommunity.trim(),
  });

  if (params.tier !== 'national' && params.state?.trim()) query.set('state', params.state.trim());
  if (params.tier === 'city' && params.city?.trim()) query.set('city', params.city.trim());

  const response = await api.get<DiscoverItem[]>(`/discover/scenes?${query.toString()}`, {
    token,
  });
  return response.data ?? [];
}

export async function tuneDiscoverScene(sceneId: string, token: string): Promise<DiscoveryContext> {
  const response = await api.post<DiscoveryContext>('/discover/tune', { sceneId }, { token });
  if (!response.data) {
    throw new Error('Tune scene response was empty.');
  }
  return response.data;
}

export interface SetHomeSceneResult extends DiscoveryContext {
  homeScene: {
    city: string | null;
    state: string | null;
    musicCommunity: string | null;
  };
}

export async function setDiscoverHomeScene(sceneId: string, token: string): Promise<SetHomeSceneResult> {
  const response = await api.post<SetHomeSceneResult>('/discover/set-home-scene', { sceneId }, { token });
  if (!response.data) {
    throw new Error('Set Home Scene response was empty.');
  }
  return response.data;
}
