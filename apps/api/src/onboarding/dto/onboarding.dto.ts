import { z } from 'zod';

export const HomeSceneSelectionSchema = z.object({
  city: z.string().min(1).max(120),
  state: z.string().min(1).max(120),
  musicCommunity: z.string().min(2).max(200),
  tasteTag: z.string().min(1).max(120).optional(),
});

export type HomeSceneSelectionDto = z.infer<typeof HomeSceneSelectionSchema>;

export const GpsVerifySchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type GpsVerifyDto = z.infer<typeof GpsVerifySchema>;
