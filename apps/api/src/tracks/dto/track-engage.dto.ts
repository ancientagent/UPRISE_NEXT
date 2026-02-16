import { z } from 'zod';

// Canon engagement types (3/2/1/0 model)
export const EngagementTypeSchema = z.enum(['full', 'majority', 'partial', 'skip']);

export const TrackEngageSchema = z.object({
  sessionId: z.string().min(1, 'sessionId is required'),
  type: EngagementTypeSchema,
});

export type EngagementType = z.infer<typeof EngagementTypeSchema>;
export type TrackEngageDto = z.infer<typeof TrackEngageSchema>;
