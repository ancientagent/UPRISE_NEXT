import { z } from 'zod';

export const ArtistBandRegistrationSchema = z.object({
  sceneId: z.string().uuid(),
  name: z.string().trim().min(1).max(140),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  entityType: z.enum(['artist', 'band']),
  members: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(140),
        email: z.string().trim().email(),
        city: z.string().trim().min(1).max(120),
        instrument: z.string().trim().min(1).max(120),
      }),
    )
    .min(1)
    .max(24),
});

export type ArtistBandRegistrationDto = z.infer<typeof ArtistBandRegistrationSchema>;

export const DispatchArtistInviteSchema = z.object({
  mobileAppUrl: z.string().url(),
  webAppUrl: z.string().url(),
});

export type DispatchArtistInviteDto = z.infer<typeof DispatchArtistInviteSchema>;

export const PromoterRegistrationSchema = z.object({
  sceneId: z.string().uuid(),
  productionName: z.string().trim().min(1).max(140),
});

export type PromoterRegistrationDto = z.infer<typeof PromoterRegistrationSchema>;

export const ProjectRegistrationSchema = z.object({
  sceneId: z.string().uuid(),
  projectName: z.string().trim().min(1).max(140),
});

export type ProjectRegistrationDto = z.infer<typeof ProjectRegistrationSchema>;
