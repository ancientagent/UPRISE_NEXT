import { z } from 'zod';

export const FairPlayGraduationRequestSchema = z.object({
  communityId: z.string().trim().min(1),
  asOf: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'asOf must be YYYY-MM-DD')
    .optional(),
  dryRun: z.boolean().default(true),
});

export type FairPlayGraduationRequestDto = z.infer<typeof FairPlayGraduationRequestSchema>;
