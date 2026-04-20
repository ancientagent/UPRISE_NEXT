import { api } from '@/lib/api';

interface CollectSignalResponse {
  action: {
    id: string;
    type: string;
    signalId: string;
    userId: string;
    createdAt: string;
  };
  item: {
    id: string;
    collectionId: string;
    signalId: string;
    createdAt: string;
  };
  collectionId: string;
  shelf: string;
}

interface RecommendSignalResponse {
  id: string;
  type: string;
  signalId: string;
  userId: string;
  createdAt: string;
}

export async function collectSignal(signalId: string, token: string): Promise<CollectSignalResponse> {
  const response = await api.post<CollectSignalResponse>(`/signals/${signalId}/collect`, {}, { token });
  if (!response.data) {
    throw new Error('Collect response was empty.');
  }
  return response.data;
}

export async function recommendSignal(signalId: string, token: string): Promise<RecommendSignalResponse> {
  const response = await api.post<RecommendSignalResponse>(`/signals/${signalId}/recommend`, {}, { token });
  if (!response.data) {
    throw new Error('Recommend response was empty.');
  }
  return response.data;
}
