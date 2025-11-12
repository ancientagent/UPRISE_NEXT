
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(30),
  displayName: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  location: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      city: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  isVerified: z.boolean().default(false),
  isArtist: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.pick({
  email: true,
  username: true,
  displayName: true,
}).extend({
  password: z.string().min(8),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;
