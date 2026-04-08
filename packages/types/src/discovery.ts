import { z } from 'zod';

export const DiscoverySceneSummarySchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  name: z.string(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  musicCommunity: z.string().nullable(),
  tier: z.string(),
  isActive: z.boolean(),
});

export type DiscoverySceneSummary = z.infer<typeof DiscoverySceneSummarySchema>;

export const DiscoverArtistResultSchema = z.object({
  artistBandId: z.string().uuid().or(z.string().min(1)),
  name: z.string(),
  slug: z.string(),
  entityType: z.string(),
  homeSceneId: z.string().uuid().or(z.string().min(1)).nullable(),
  homeSceneName: z.string().nullable(),
  homeSceneCity: z.string().nullable(),
  homeSceneState: z.string().nullable(),
  homeSceneMusicCommunity: z.string().nullable(),
  memberCount: z.number().int().nonnegative(),
  followCount: z.number().int().nonnegative(),
});

export type DiscoverArtistResult = z.infer<typeof DiscoverArtistResultSchema>;

export const DiscoverSongResultSchema = z.object({
  trackId: z.string().uuid().or(z.string().min(1)),
  title: z.string(),
  artist: z.string(),
  artistBandId: z.string().uuid().or(z.string().min(1)).nullable(),
  artistBandName: z.string().nullable(),
  coverArt: z.string().nullable(),
  playCount: z.number().int().nonnegative(),
  likeCount: z.number().int().nonnegative(),
  status: z.string(),
  communityId: z.string().uuid().or(z.string().min(1)).nullable(),
  communityName: z.string().nullable(),
  communityCity: z.string().nullable(),
  communityState: z.string().nullable(),
  communityMusicCommunity: z.string().nullable(),
});

export type DiscoverSongResult = z.infer<typeof DiscoverSongResultSchema>;

export const DiscoverSignalResultSchema = z.object({
  signalId: z.string().uuid().or(z.string().min(1)),
  type: z.string(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  communityId: z.string().uuid().or(z.string().min(1)).nullable(),
  communityCity: z.string().nullable().optional(),
  communityState: z.string().nullable().optional(),
  communityMusicCommunity: z.string().nullable().optional(),
  createdAt: z.string(),
  actionCounts: z.object({
    add: z.number().int().nonnegative(),
    blast: z.number().int().nonnegative(),
    support: z.number().int().nonnegative(),
    recommend: z.number().int().nonnegative(),
  }),
  lensMetricValue: z.number().int().nonnegative().nullable().optional(),
  lensMetricLabel: z.string().nullable().optional(),
  highestScopeReached: z.string().nullable().optional(),
  lastRiseAt: z.string().nullable().optional(),
});

export type DiscoverSignalResult = z.infer<typeof DiscoverSignalResultSchema>;

export const DiscoverRecommendationActorSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  username: z.string(),
  displayName: z.string(),
  avatar: z.string().nullable(),
});

export type DiscoverRecommendationActor = z.infer<typeof DiscoverRecommendationActorSchema>;

export const DiscoverRecommendationResultSchema = z.object({
  recommendationId: z.string().uuid().or(z.string().min(1)),
  createdAt: z.string(),
  actor: DiscoverRecommendationActorSchema,
  signal: DiscoverSignalResultSchema,
});

export type DiscoverRecommendationResult = z.infer<typeof DiscoverRecommendationResultSchema>;

export const DiscoverPopularSinglesSchema = z.object({
  mostAdded: z.array(DiscoverSignalResultSchema),
  supportedNow: z.array(DiscoverSignalResultSchema),
  recentRises: z.array(DiscoverSignalResultSchema),
});

export type DiscoverPopularSingles = z.infer<typeof DiscoverPopularSinglesSchema>;

export const CommunityDiscoverSearchResultSchema = z.object({
  community: DiscoverySceneSummarySchema,
  query: z.string(),
  artists: z.array(DiscoverArtistResultSchema),
  songs: z.array(DiscoverSongResultSchema),
});

export type CommunityDiscoverSearchResult = z.infer<typeof CommunityDiscoverSearchResultSchema>;

export const CommunityDiscoverHighlightsSchema = z.object({
  community: DiscoverySceneSummarySchema,
  popularSingles: DiscoverPopularSinglesSchema,
  recommendations: z.array(DiscoverRecommendationResultSchema),
});

export type CommunityDiscoverHighlights = z.infer<typeof CommunityDiscoverHighlightsSchema>;

export const SaveDiscoverUpriseResultSchema = z.object({
  scene: DiscoverySceneSummarySchema,
  signalId: z.string().uuid().or(z.string().min(1)),
  collectionId: z.string().uuid().or(z.string().min(1)),
  collectionItemId: z.string().uuid().or(z.string().min(1)),
  actionId: z.string().uuid().or(z.string().min(1)),
  shelf: z.literal('uprises'),
});

export type SaveDiscoverUpriseResult = z.infer<typeof SaveDiscoverUpriseResultSchema>;
