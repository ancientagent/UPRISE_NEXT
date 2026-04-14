import { z } from 'zod';

export const ArtistBandMemberUserSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  username: z.string(),
  displayName: z.string(),
  avatar: z.string().nullable().optional(),
});

export const ArtistBandMemberSchema = z.object({
  userId: z.string().uuid().or(z.string().min(1)),
  role: z.string(),
  createdAt: z.string(),
  user: ArtistBandMemberUserSchema,
});

export const ArtistBandHomeSceneSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  name: z.string(),
  slug: z.string(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  musicCommunity: z.string().nullable(),
  tier: z.string(),
});

export const ArtistBandTrackSummarySchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  artistBandId: z.string().uuid().or(z.string().min(1)).nullable().optional(),
  title: z.string(),
  artist: z.string(),
  album: z.string().nullable(),
  duration: z.number(),
  fileUrl: z.string(),
  coverArt: z.string().nullable(),
  playCount: z.number().int().nonnegative(),
  likeCount: z.number().int().nonnegative(),
  status: z.string(),
  createdAt: z.string(),
});

export const ArtistBandEventSummarySchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  artistBandId: z.string().uuid().or(z.string().min(1)).nullable().optional(),
  title: z.string(),
  description: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  locationName: z.string(),
  address: z.string(),
  attendeeCount: z.number().int().nonnegative(),
  createdAt: z.string(),
});

export const ArtistBandProfileSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  name: z.string(),
  slug: z.string(),
  entityType: z.string(),
  registrarEntryRef: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  bio: z.string().nullable(),
  avatar: z.string().nullable(),
  coverImage: z.string().nullable(),
  createdBy: ArtistBandMemberUserSchema,
  homeScene: ArtistBandHomeSceneSchema.nullable(),
  members: z.array(ArtistBandMemberSchema),
  memberCount: z.number().int().nonnegative(),
  followCount: z.number().int().nonnegative(),
  tracks: z.array(ArtistBandTrackSummarySchema),
  events: z.array(ArtistBandEventSummarySchema),
});

export type ArtistBandProfile = z.infer<typeof ArtistBandProfileSchema>;
export type ArtistBandTrackSummary = z.infer<typeof ArtistBandTrackSummarySchema>;
export type ArtistBandEventSummary = z.infer<typeof ArtistBandEventSummarySchema>;
