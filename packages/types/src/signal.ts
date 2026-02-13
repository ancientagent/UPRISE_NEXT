import { z } from 'zod';

export const SignalSchema = z.object({
  id: z.string().uuid(),
  type: z.string().min(2).max(64),
  metadata: z.unknown().optional(),
  communityId: z.string().uuid().optional().nullable(),
  createdById: z.string().uuid().optional().nullable(),
  createdAt: z.date(),
});

export type Signal = z.infer<typeof SignalSchema>;

export const CreateSignalSchema = SignalSchema.omit({
  id: true,
  createdAt: true,
}).extend({
  metadata: z.unknown().optional(),
});

export type CreateSignal = z.infer<typeof CreateSignalSchema>;

export const SignalActionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['ADD', 'BLAST', 'SUPPORT']),
  userId: z.string().uuid(),
  signalId: z.string().uuid(),
  createdAt: z.date(),
});

export type SignalAction = z.infer<typeof SignalActionSchema>;

export const FollowSchema = z.object({
  id: z.string().uuid(),
  followerId: z.string().uuid(),
  entityType: z.string().min(2).max(64),
  entityId: z.string().min(1).max(120),
  createdAt: z.date(),
});

export type Follow = z.infer<typeof FollowSchema>;
