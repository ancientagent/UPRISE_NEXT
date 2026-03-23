import { api } from '@/lib/api';
import type { ArtistBandProfile } from '@uprise/types';

export async function getArtistBandProfile(id: string, token: string): Promise<ArtistBandProfile> {
  const response = await api.get<ArtistBandProfile>(`/artist-bands/${id}/profile`, { token });
  if (!response.data) {
    throw new Error('Artist profile response was empty.');
  }
  return response.data;
}

export async function addArtistBandSignal(id: string, token: string) {
  const response = await api.post<{ signalId: string }>(`/artist-bands/${id}/add`, {}, { token });
  if (!response.data) {
    throw new Error('Artist add response was empty.');
  }
  return response.data;
}

export async function blastArtistBandSignal(id: string, token: string) {
  const response = await api.post<{ signalId: string }>(`/artist-bands/${id}/blast`, {}, { token });
  if (!response.data) {
    throw new Error('Artist blast response was empty.');
  }
  return response.data;
}

export async function supportArtistBandSignal(id: string, token: string) {
  const response = await api.post<{ signalId: string }>(`/artist-bands/${id}/support`, {}, { token });
  if (!response.data) {
    throw new Error('Artist support response was empty.');
  }
  return response.data;
}

export async function followArtistBand(id: string, token: string) {
  const response = await api.post<{ entityId: string }>(
    '/follow',
    { entityType: 'artistBand', entityId: id },
    { token },
  );

  if (!response.data) {
    throw new Error('Artist follow response was empty.');
  }

  return response.data;
}
