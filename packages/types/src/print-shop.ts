import { z } from 'zod';

export const CreatePrintShopEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  coverImage: z.string().url().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  locationName: z.string().min(1).max(200),
  address: z.string().min(1).max(300),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  communityId: z.string().uuid(),
  artistBandId: z.string().uuid().optional(),
  maxAttendees: z.number().int().positive().optional(),
});

export type CreatePrintShopEvent = z.infer<typeof CreatePrintShopEventSchema>;

export const PrintShopEventRecordSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  coverImage: z.string().url().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  locationName: z.string().min(1).max(200),
  address: z.string().min(1).max(300),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  communityId: z.string().uuid(),
  createdById: z.string().uuid(),
  artistBandId: z.string().uuid().nullable().optional(),
  attendeeCount: z.number().int().nonnegative(),
  maxAttendees: z.number().int().positive().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type PrintShopEventRecord = z.infer<typeof PrintShopEventRecordSchema>;
