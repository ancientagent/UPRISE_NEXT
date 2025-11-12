
import { z } from 'zod';

export const CommunitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(1000),
  coverImage: z.string().url().optional(),
  avatar: z.string().url().optional(),
  geofence: z
    .object({
      type: z.literal('Point'),
      coordinates: z.tuple([z.number(), z.number()]),
      radius: z.number().positive(), // in meters
    })
    .optional(),
  isPrivate: z.boolean().default(false),
  memberCount: z.number().int().nonnegative().default(0),
  createdById: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Community = z.infer<typeof CommunitySchema>;

export const CreateCommunitySchema = CommunitySchema.pick({
  name: true,
  slug: true,
  description: true,
  isPrivate: true,
}).partial({
  isPrivate: true,
});

export type CreateCommunity = z.infer<typeof CreateCommunitySchema>;

export const UpdateCommunitySchema = CommunitySchema.partial().omit({
  id: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  memberCount: true,
});

export type UpdateCommunity = z.infer<typeof UpdateCommunitySchema>;
