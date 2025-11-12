
import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000),
  coverImage: z.string().url().optional(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.object({
    name: z.string(),
    address: z.string(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  communityId: z.string().uuid(),
  createdById: z.string().uuid(),
  attendeeCount: z.number().int().nonnegative().default(0),
  maxAttendees: z.number().int().positive().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Event = z.infer<typeof EventSchema>;

export const CreateEventSchema = EventSchema.omit({
  id: true,
  attendeeCount: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateEvent = z.infer<typeof CreateEventSchema>;
