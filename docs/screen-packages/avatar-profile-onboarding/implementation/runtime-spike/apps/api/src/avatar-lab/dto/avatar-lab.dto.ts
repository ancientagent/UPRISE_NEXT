import { z } from 'zod';

const DataImageUrlSchema = z
  .string()
  .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, 'A captured image is required')
  .max(2_500_000, 'Captured image is too large');

const GeneratedAvatarDataImageUrlSchema = z
  .string()
  .regex(/^data:image\/png;base64,[A-Za-z0-9+/=]+$/, 'A generated avatar is required')
  .max(6_500_000, 'Generated avatar is too large');

export const GenerateAvatarCandidatesSchema = z.object({
  capturedPhoto: DataImageUrlSchema,
  musicCommunity: z.string().min(1).max(80),
  likenessConsent: z.literal(true),
});

export type GenerateAvatarCandidatesDto = z.infer<typeof GenerateAvatarCandidatesSchema>;

export const SaveAvatarSelectionSchema = z.object({
  avatar: GeneratedAvatarDataImageUrlSchema,
  musicCommunity: z.string().min(1).max(80),
  likenessConsent: z.literal(true),
  bio: z.string().trim().max(1_000).optional(),
});

export type SaveAvatarSelectionDto = z.infer<typeof SaveAvatarSelectionSchema>;
