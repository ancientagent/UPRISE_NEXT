import { z } from 'zod';

export const CreateTrackSchema = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().min(1).max(200),
  artistBandId: z.string().uuid().optional(),
  album: z.string().max(200).optional(),
  duration: z.number().positive(),
  fileUrl: z.string().url(),
  coverArt: z.string().url().optional(),
  communityId: z.string().uuid().optional(),
  status: z.enum(['processing', 'ready', 'failed']).optional(),
});

export type CreateTrackDto = z.infer<typeof CreateTrackSchema>;
