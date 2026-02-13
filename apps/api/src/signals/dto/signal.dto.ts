import { z } from 'zod';

export const CreateSignalSchema = z.object({
  type: z.string().min(2).max(64),
  metadata: z.unknown().optional(),
  communityId: z.string().uuid().optional(),
});

export type CreateSignalDto = z.infer<typeof CreateSignalSchema>;

export const FollowSchema = z.object({
  entityType: z.string().min(2).max(64),
  entityId: z.string().min(1).max(120),
});

export type FollowDto = z.infer<typeof FollowSchema>;
