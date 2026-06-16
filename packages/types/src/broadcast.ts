import { z } from 'zod';
import { TrackSchema } from './track';

export const BroadcastTierSchema = z.enum(['city', 'state', 'national']);
export type BroadcastTier = z.infer<typeof BroadcastTierSchema>;

export const BroadcastRotationSchema = z.object({
  newReleases: z.array(TrackSchema),
  mainRotation: z.array(TrackSchema),
});

export type BroadcastRotation = z.infer<typeof BroadcastRotationSchema>;

export interface BroadcastRotationMeta {
  sceneId: string;
  sceneName?: string;
  sceneCity?: string | null;
  sceneState?: string | null;
  sceneMusicCommunity?: string | null;
  sceneTier?: string;
  requestedTier?: BroadcastTier;
  generatedAt: string;
  newReleasesCount: number;
  mainRotationCount: number;
}
