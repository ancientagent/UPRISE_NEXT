import { z } from 'zod';

export const TrackVoteSchema = z.object({
  sceneId: z.string().min(1, 'sceneId is required'),
  playbackSessionId: z.string().min(1, 'playbackSessionId is required'),
  nowPlayingTrackId: z.string().min(1, 'nowPlayingTrackId is required'),
});

export type TrackVoteDto = z.infer<typeof TrackVoteSchema>;
