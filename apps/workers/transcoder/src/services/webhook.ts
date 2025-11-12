
interface WebhookPayload {
  status: 'ready' | 'failed';
  outputs?: Array<{ format: string; bitrate: string; url: string }>;
  waveformData?: number[];
  error?: string;
}

export async function notifyAPI(trackId: string, payload: WebhookPayload): Promise<void> {
  const apiUrl = process.env.API_URL || 'http://localhost:4000';
  const webhookSecret = process.env.WEBHOOK_SECRET;

  try {
    const response = await fetch(`${apiUrl}/webhooks/transcode/${trackId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': webhookSecret || '',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }

    console.log(`✅ Notified API about track ${trackId}`);
  } catch (error: any) {
    console.error(`❌ Failed to notify API about track ${trackId}:`, error.message);
    // Don't throw - we don't want to fail the job if webhook fails
  }
}
