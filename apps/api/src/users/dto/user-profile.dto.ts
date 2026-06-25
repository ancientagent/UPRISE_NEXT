import { z } from 'zod';

export const SetCollectionDisplaySchema = z.object({
  enabled: z.boolean(),
});

export type SetCollectionDisplayDto = z.infer<typeof SetCollectionDisplaySchema>;

export const MusicCommunityPreferenceSchema = z.object({
  musicCommunity: z.string().min(1),
});

export type MusicCommunityPreferenceDto = z.infer<typeof MusicCommunityPreferenceSchema>;
