import { z } from 'zod';

export const AdminAnalyticsSignalRowSchema = z.object({
  trackId: z.string(),
  title: z.string(),
  artist: z.string(),
  communityName: z.string().nullable(),
  communityTier: z.string().nullable(),
  value: z.number(),
});

export const RetainedMetricValueSchema = z.object({
  tracked: z.boolean(),
  reason: z.string().nullable().optional(),
  total: z.number().optional(),
  counts: z.record(z.string(), z.number()).optional(),
  items: z.array(AdminAnalyticsSignalRowSchema).optional(),
});

export const AdminAnalyticsQueryDataSchema = z.object({
  platformTotals: z.object({
    users: z.number(),
    communities: z.number(),
    artistBands: z.number(),
    events: z.number(),
    tracks: z.number(),
    signals: z.number(),
    follows: z.number(),
  }),
  signalActionTotals: z.object({
    add: z.number(),
    blast: z.number(),
    recommend: z.number(),
    upvote: z.number(),
  }),
  retainedMetrics: z.object({
    listenCountAllTime: RetainedMetricValueSchema,
    mostListenedSignals: RetainedMetricValueSchema,
    mostUpvotedSignals: RetainedMetricValueSchema,
    mixtapeAppearanceCount: RetainedMetricValueSchema,
    appearanceCountByTier: RetainedMetricValueSchema,
  }),
});

export type AdminAnalyticsQueryData = z.infer<typeof AdminAnalyticsQueryDataSchema>;
