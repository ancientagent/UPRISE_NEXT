
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCommunityWithGeoDto,
  FindNearbyCommunitiesDto,
  VerifyLocationDto,
  CommunityWithDistance,
} from './dto/community.dto';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create community with optional geospatial data
   */
  async create(
    data: CreateCommunityWithGeoDto & { createdById: string }
  ) {
    const { lat, lng, radius, ...communityData } = data;

    // If lat/lng provided, create PostGIS geography point
    if (lat !== undefined && lng !== undefined) {
      // PostGIS uses SRID 4326 (WGS 84) for GPS coordinates
      // Format: ST_GeogFromText('POINT(longitude latitude)')
      // Note: PostGIS expects longitude first, then latitude!
      // We need to use raw SQL because geofence is Unsupported type
      const result = await this.prisma.$queryRaw<any[]>`
        INSERT INTO communities (id, name, slug, description, "coverImage", avatar, "isPrivate", "memberCount", "createdById", geofence, radius, "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(),
          ${communityData.name},
          ${communityData.slug},
          ${communityData.description},
          ${communityData.coverImage || null},
          ${communityData.avatar || null},
          ${communityData.isPrivate || false},
          0,
          ${communityData.createdById},
          ST_GeogFromText(${`POINT(${lng} ${lat})`}),
          ${radius || null},
          NOW(),
          NOW()
        )
        RETURNING
          id,
          name,
          slug,
          description,
          "coverImage",
          avatar,
          "isPrivate",
          "memberCount",
          "createdById",
          radius,
          "createdAt",
          "updatedAt"
      `;
      
      return result[0];
    } else {
      // No geospatial data, use regular Prisma create
      return this.prisma.community.create({
        data: {
          ...communityData,
          radius: radius || null,
        },
      });
    }
  }

  /**
   * Find communities within radius of given coordinates
   * Uses PostGIS ST_DWithin for efficient spatial queries
   */
  async findNearby(params: FindNearbyCommunitiesDto): Promise<CommunityWithDistance[]> {
    const { lat, lng, radius, limit } = params;

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      throw new BadRequestException('Invalid coordinates: lat and lng must be valid numbers');
    }

    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Invalid latitude: must be between -90 and 90');
    }

    if (lng < -180 || lng > 180) {
      throw new BadRequestException('Invalid longitude: must be between -180 and 180');
    }

    try {
      // Create point for user's location
      const userPoint = `POINT(${lng} ${lat})`;

      // Use PostGIS ST_DWithin for spatial query
      // ST_Distance returns distance in meters for geography type
      const communities = await this.prisma.$queryRaw<CommunityWithDistance[]>`
        SELECT 
          id,
          name,
          slug,
          description,
          "coverImage",
          avatar,
          "isPrivate",
          "memberCount",
          "createdAt",
          "updatedAt",
          ST_Distance(geofence, ST_GeogFromText(${userPoint})) as distance
        FROM communities
        WHERE 
          geofence IS NOT NULL
          AND ST_DWithin(
            geofence,
            ST_GeogFromText(${userPoint}),
            ${radius}
          )
        ORDER BY distance ASC
        LIMIT ${limit}
      `;

      return communities.map((c: CommunityWithDistance) => ({
        ...c,
        distance: Math.round(Number(c.distance)), // Round to nearest meter (driver may return string)
      }));
    } catch (error) {
      // Check if it's a PostGIS error
      if (error instanceof Error && error.message.includes('PostGIS')) {
        throw new InternalServerErrorException(
          'PostGIS geospatial query failed. Please ensure PostGIS extension is properly installed.'
        );
      }
      throw new InternalServerErrorException(
        `Failed to find nearby communities: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Verify if user's location is within community's geofence
   */
  async verifyLocation(communityId: string, location: VerifyLocationDto) {
    const { lat, lng } = location;

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      throw new BadRequestException('Invalid coordinates: lat and lng must be valid numbers');
    }

    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Invalid latitude: must be between -90 and 90');
    }

    if (lng < -180 || lng > 180) {
      throw new BadRequestException('Invalid longitude: must be between -180 and 180');
    }

    // First check if community exists (without selecting geofence)
    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
      select: {
        id: true,
        name: true,
        radius: true,
      },
    });

    if (!community) {
      throw new NotFoundException(`Community with ID ${communityId} not found`);
    }

    try {
      // Check if geofence exists and radius is set using raw query
      const geofenceCheck = await this.prisma.$queryRaw<Array<{ has_geofence: boolean }>>`
        SELECT (geofence IS NOT NULL AND radius IS NOT NULL) as has_geofence
        FROM communities
        WHERE id = ${communityId}
      `;

      if (!geofenceCheck[0]?.has_geofence) {
        throw new BadRequestException(
          'Community does not have geofencing enabled'
        );
      }

      // Check if user is within community radius
      const userPoint = `POINT(${lng} ${lat})`;

      const result = await this.prisma.$queryRaw<Array<{ within: boolean; distance: number }>>`
        SELECT 
          ST_DWithin(
            geofence,
            ST_GeogFromText(${userPoint}),
            radius
          ) as within,
          ST_Distance(geofence, ST_GeogFromText(${userPoint})) as distance
        FROM communities
        WHERE id = ${communityId}
      `;

      if (!result || result.length === 0) {
        throw new NotFoundException('Community geofence data not found');
      }

      return {
        within: result[0].within,
        distance: Math.round(result[0].distance),
        communityId: community.id,
        communityName: community.name,
        allowedRadius: community.radius,
      };
    } catch (error) {
      // Re-throw known errors
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      // Check if it's a PostGIS error
      if (error instanceof Error && error.message.includes('PostGIS')) {
        throw new InternalServerErrorException(
          'PostGIS geospatial query failed. Please ensure PostGIS extension is properly installed.'
        );
      }
      
      throw new InternalServerErrorException(
        `Failed to verify location: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get community by ID with geospatial data
   */
  async findById(id: string) {
    const community = await this.prisma.community.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
            tracks: true,
            events: true,
          },
        },
      },
    });

    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }

    // Extract lat/lng from PostGIS geography if available (check using raw query)
    let coordinates = null;
    const geofenceResult = await this.prisma.$queryRaw<Array<{ lat: number; lng: number; has_geofence: boolean }>>`
      SELECT 
        ST_Y(geofence::geometry) as lat,
        ST_X(geofence::geometry) as lng,
        (geofence IS NOT NULL) as has_geofence
      FROM communities
      WHERE id = ${id}
    `;
    
    if (geofenceResult[0]?.has_geofence) {
      coordinates = {
        lat: geofenceResult[0].lat,
        lng: geofenceResult[0].lng,
      };
    }

    return {
      ...community,
      coordinates,
    };
  }

  /**
   * Find many communities with pagination
   */
  async findMany(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [communities, total] = await Promise.all([
      this.prisma.community.findMany({
        skip,
        take: limit,
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
            },
          },
          _count: {
            select: { members: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.community.count(),
    ]);

    return { communities, total, page, limit };
  }
}
