import { z } from 'zod';

export const ReleaseDeckMeasurementQuerySchema = z.object({
  communityId: z.string().trim().min(1),
});

export type ReleaseDeckMeasurementQueryDto = z.infer<typeof ReleaseDeckMeasurementQuerySchema>;
