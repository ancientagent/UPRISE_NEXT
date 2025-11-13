
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
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
    let geofence: Prisma.CommunityCreateInput['geofence'] = undefined;
    if (lat !== undefined && lng !== undefined) {
      // PostGIS uses SRID 4326 (WGS 84) for GPS coordinates
      // Format: ST_GeogFromText('POINT(longitude latitude)')
      // Note: PostGIS expects longitude first, then latitude!
      geofence = Prisma.sql`ST_GeogFromText('POINT(${Prisma.raw(String(lng))} ${Prisma.raw(String(lat))})')` as any;
    }

    return this.prisma.community.create({
      data: {
        ...communityData,
        geofence,
        radius: radius || null,
      },
    });
  }

  /**
   * Find communities within radius of given coordinates
   * Uses PostGIS ST_DWithin for efficient spatial queries
   */
  async findNearby(params: FindNearbyCommunitiesDto): Promise<CommunityWithDistance[]> {
    const { lat, lng, radius, limit } = params;

    // Create point for user's location
    const userPoint = `POINT(${lng} ${lat})`;

    // Use PostGIS ST_DWithin for spatial query
    // ST_Distance returns distance in meters for geography type
    const communities = await this.prisma.$queryRaw<any[]>`
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

    return communities.map(c => ({
      ...c,
      distance: Math.round(c.distance), // Round to nearest meter
    }));
  }

  /**
   * Verify if user's location is within community's geofence
   */
  async verifyLocation(communityId: string, location: VerifyLocationDto) {
    const { lat, lng } = location;

    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
      select: {
        id: true,
        name: true,
        radius: true,
        geofence: true,
      },
    });

    if (!community) {
      throw new NotFoundException(`Community with ID ${communityId} not found`);
    }

    if (!community.geofence || !community.radius) {
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

    // Extract lat/lng from PostGIS geography if available
    let coordinates = null;
    if (community.geofence) {
      const result = await this.prisma.$queryRaw<Array<{ lat: number; lng: number }>>`
        SELECT 
          ST_Y(geofence::geometry) as lat,
          ST_X(geofence::geometry) as lng
        FROM communities
        WHERE id = ${id}
      `;
      coordinates = result[0] || null;
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
