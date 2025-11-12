
import { z } from 'zod';

export const TrackSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  artist: z.string().min(1).max(200),
  album: z.string().max(200).optional(),
  duration: z.number().positive(), // in seconds
  fileUrl: z.string().url(),
  coverArt: z.string().url().optional(),
  waveformData: z.array(z.number()).optional(),
  uploadedById: z.string().uuid(),
  communityId: z.string().uuid().optional(),
  playCount: z.number().int().nonnegative().default(0),
  likeCount: z.number().int().nonnegative().default(0),
  status: z.enum(['processing', 'ready', 'failed']).default('processing'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Track = z.infer<typeof TrackSchema>;

export const UploadTrackSchema = TrackSchema.pick({
  title: true,
  artist: true,
  album: true,
  communityId: true,
});

export type UploadTrack = z.infer<typeof UploadTrackSchema>;

export const UpdateTrackSchema = TrackSchema.partial().omit({
  id: true,
  uploadedById: true,
  createdAt: true,
  updatedAt: true,
  playCount: true,
  likeCount: true,
  status: true,
});

export type UpdateTrack = z.infer<typeof UpdateTrackSchema>;
