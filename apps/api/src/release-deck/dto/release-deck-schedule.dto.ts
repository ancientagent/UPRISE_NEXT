import { z } from 'zod';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateOnly(value: string): boolean {
  if (!DATE_ONLY.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export const ReleaseDeckScheduleAvailabilityQuerySchema = z.object({
  communityId: z.string().trim().min(1),
  trackId: z.string().trim().min(1),
  from: z.string().trim().refine(isValidDateOnly, 'from must be a valid YYYY-MM-DD date'),
  days: z.coerce.number().int().min(1).max(30).optional().default(30),
});

export type ReleaseDeckScheduleAvailabilityQueryDto = z.infer<
  typeof ReleaseDeckScheduleAvailabilityQuerySchema
>;

export const ReleaseDeckScheduleCreateSchema = z
  .object({
    communityId: z.string().trim().min(1),
    trackId: z.string().trim().min(1),
    mode: z.enum(['soonest', 'chosen']),
    requestedDate: z
      .string()
      .trim()
      .refine(isValidDateOnly, 'requestedDate must be a valid YYYY-MM-DD date')
      .optional(),
  })
  .superRefine((value, ctx) => {
    if (value.mode === 'chosen' && !value.requestedDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['requestedDate'],
        message: 'requestedDate is required when mode is chosen',
      });
    }
  });

export type ReleaseDeckScheduleCreateDto = z.infer<typeof ReleaseDeckScheduleCreateSchema>;
