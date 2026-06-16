import { api } from '@/lib/api';
import type { CreateTrackInput, Track } from '@uprise/types';

export async function createTrack(input: CreateTrackInput, token: string): Promise<Track> {
  const response = await api.post<Track>('/tracks', input, { token });
  if (!response.data) {
    throw new Error('Track create response was empty.');
  }
  return response.data;
}
