import type { CreatePrintShopEvent, PrintShopEventRecord } from '@uprise/types';
import { api } from '@/lib/api';

export async function createPrintShopEvent(
  payload: CreatePrintShopEvent,
  token: string,
): Promise<PrintShopEventRecord> {
  const response = await api.post<PrintShopEventRecord>('/print-shop/events', payload, { token });

  if (!response.data) {
    throw new Error('Print Shop event creation response returned no data.');
  }

  return response.data;
}
