import { z } from 'zod';

export const ArtistBandRegistrationSchema = z.object({
  sceneId: z.string().uuid(),
  name: z.string().min(1).max(140),
  slug: z
    .string()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  entityType: z.enum(['artist', 'band']),
});

export type ArtistBandRegistrationDto = z.infer<typeof ArtistBandRegistrationSchema>;
