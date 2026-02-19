import { z } from 'zod';

export const SetCollectionDisplaySchema = z.object({
  enabled: z.boolean(),
});

export type SetCollectionDisplayDto = z.infer<typeof SetCollectionDisplaySchema>;
