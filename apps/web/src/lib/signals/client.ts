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

export async function collectSignal(signalId: string, token: string): Promise<CollectSignalResponse> {
  const response = await api.post<CollectSignalResponse>(`/signals/${signalId}/collect`, {}, { token });
  if (!response.data) {
    throw new Error('Collect response was empty.');
  }
  return response.data;
}
