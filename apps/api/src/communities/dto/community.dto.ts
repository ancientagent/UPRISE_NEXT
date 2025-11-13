
import { z } from 'zod';

/**
 * Zod validation schemas for geospatial data
 */

// Latitude validation: -90 to 90
export const LatitudeSchema = z
  .number()
  .min(-90, 'Latitude must be >= -90')
  .max(90, 'Latitude must be <= 90');

// Longitude validation: -180 to 180
export const LongitudeSchema = z
  .number()
  .min(-180, 'Longitude must be >= -180')
  .max(180, 'Longitude must be <= 180');

// GPS coordinates
export const GpsCoordinatesSchema = z.object({
  lat: LatitudeSchema,
  lng: LongitudeSchema,
});

// Radius validation (in meters, max 50km)
export const RadiusSchema = z
  .number()
  .min(10, 'Radius must be at least 10 meters')
  .max(50000, 'Radius must be at most 50km');

/**
 * Create community with geospatial data
 */
export const CreateCommunityWithGeoSchema = z.object({
  name: z.string().min(3).max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(1000),
  coverImage: z.string().url().optional(),
  avatar: z.string().url().optional(),
  isPrivate: z.boolean().optional().default(false),
  // Geospatial fields
  lat: LatitudeSchema.optional(),
  lng: LongitudeSchema.optional(),
  radius: RadiusSchema.optional(),
});

export type CreateCommunityWithGeoDto = z.infer<typeof CreateCommunityWithGeoSchema>;

/**
 * Find nearby communities
 */
export const FindNearbyCommunitiesSchema = z.object({
  lat: LatitudeSchema,
  lng: LongitudeSchema,
  radius: RadiusSchema.optional().default(5000), // Default 5km
  limit: z.number().int().min(1).max(100).optional().default(20),
});

export type FindNearbyCommunities Dto = z.infer<typeof FindNearbyCommunitiesSchema>;

/**
 * Verify user location within community geofence
 */
export const VerifyLocationSchema = z.object({
  lat: LatitudeSchema,
  lng: LongitudeSchema,
});

export type VerifyLocationDto = z.infer<typeof VerifyLocationSchema>;

/**
 * Response schemas
 */
export const CommunityWithDistanceSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  coverImage: z.string().nullable(),
  avatar: z.string().nullable(),
  isPrivate: z.boolean(),
  memberCount: z.number(),
  distance: z.number(), // Distance in meters
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CommunityWithDistance = z.infer<typeof CommunityWithDistanceSchema>;
