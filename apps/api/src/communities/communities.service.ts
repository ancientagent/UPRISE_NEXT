
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCommunityWithGeoDto,
  FindNearbyCommunitiesDto,
  VerifyLocationDto,
  CommunityWithDistance,
  GetCommunityFeedDto,
  GetCommunityStatisticsDto,
  GetCommunitySceneMapDto,
  GetCommunityEventsDto,
  GetCommunityPromotionsDto,
  ResolveHomeCommunityDto,
  GetDiscoverScenesDto,
  PostDiscoverSetHomeSceneDto,
  PostDiscoverTuneDto,
} from './dto/community.dto';

type FeedItemType = 'blast' | 'track_release' | 'event_created' | 'signal_created';

interface CommunityFeedItem {
  id: string;
  type: FeedItemType;
  occurredAt: Date;
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  } | null;
  entity: {
    type: 'signal' | 'track' | 'event';
    id: string;
  };
  metadata?: Record<string, unknown>;
}

export interface CommunityStatistics {
  community: {
    id: string;
    name: string;
    city: string | null;
    state: string | null;
    musicCommunity: string | null;
    tier: string;
    isActive: boolean;
  };
  tierScope: 'city' | 'state' | 'national';
  rollupUnit: 'local_sect' | 'city' | 'state';
  metrics: {
    totalMembers: number;
    activeSects: number;
    eventsThisWeek: number;
    activityScore: number;
    activeTracks: number;
    gpsVerifiedUsers: number;
    votingEligibleUsers: number;
    scopeCommunityCount: number;
  };
  topSongs: Array<{
    trackId: string;
    title: string;
    artist: string;
    duration: number;
    playCount: number;
    communityId: string | null;
    communityName: string | null;
  }>;
  timeWindow: {
    days: number;
    asOf: string;
  };
}

interface SceneMapPoint {
  id: string;
  label: string;
  lat: number | null;
  lng: number | null;
  memberCount: number;
  activeTracks: number;
  activeSects: number;
  eventsThisWeek: number;
  kind: 'community' | 'city' | 'state';
}

interface ScopeCommunity {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  memberCount: number;
}

export interface CommunitySceneMap {
  community: {
    id: string;
    name: string;
    city: string | null;
    state: string | null;
    musicCommunity: string | null;
  };
  tierScope: 'city' | 'state' | 'national';
  rollupUnit: 'local_sect' | 'city' | 'state';
  center: { lat: number; lng: number } | null;
  points: SceneMapPoint[];
  timeWindow: {
    days: number;
    asOf: string;
  };
}

interface CommunityEventItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  locationName: string;
  address: string;
  attendeeCount: number;
  maxAttendees: number | null;
  createdAt: string;
  createdBy: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  } | null;
}

interface CommunityPromotionItem {
  id: string;
  type: string;
  createdAt: string;
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  } | null;
  metadata: Record<string, unknown> | null;
}

interface DiscoverCitySceneItem {
  entryType: 'city_scene';
  sceneId: string;
  name: string;
  city: string | null;
  state: string | null;
  musicCommunity: string | null;
  memberCount: number;
  isActive: boolean;
  isHomeScene: boolean;
}

interface DiscoverStateRollupItem {
  entryType: 'state_rollup';
  state: string;
  musicCommunity: string;
  citySceneCount: number;
  totalMembers: number;
  representativeSceneId: string | null;
  isHomeSceneState: boolean;
}

interface DiscoverCitySceneRow {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  musicCommunity: string | null;
  memberCount: number;
  isActive: boolean;
}

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Deterministic scene discovery list (no personalization/ranking).
   * Scope:
   * - city/state: city-scene entries
   * - national: state rollups derived from city scenes
   */
  async discoverScenes(userId: string, query: GetDiscoverScenesDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        homeSceneCity: true,
        homeSceneState: true,
        homeSceneCommunity: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const tier = query.tier;
    const musicCommunity = query.musicCommunity.trim();
    const stateFilter = query.state?.trim();
    const cityFilter = query.city?.trim();
    const limit = query.limit;

    const baseWhere: {
      tier: 'city';
      musicCommunity: string;
      state?: string;
      city?: string;
    } = {
      tier: 'city',
      musicCommunity,
    };

    if (tier === 'state' && stateFilter) baseWhere.state = stateFilter;
    if (tier === 'city' && stateFilter) baseWhere.state = stateFilter;
    if (tier === 'city' && cityFilter) baseWhere.city = cityFilter;

    const cityScenes: DiscoverCitySceneRow[] = await this.prisma.community.findMany({
      where: baseWhere,
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        musicCommunity: true,
        memberCount: true,
        isActive: true,
      },
      orderBy: [{ memberCount: 'desc' }, { name: 'asc' }, { id: 'asc' }],
      take: tier === 'national' ? 500 : limit,
    });

    if (tier !== 'national') {
      const items: DiscoverCitySceneItem[] = cityScenes
        .slice(0, limit)
        .map((scene: DiscoverCitySceneRow) => ({
        entryType: 'city_scene',
        sceneId: scene.id,
        name: scene.name,
        city: scene.city,
        state: scene.state,
        musicCommunity: scene.musicCommunity,
        memberCount: scene.memberCount,
        isActive: scene.isActive,
        isHomeScene:
          scene.city === user.homeSceneCity &&
          scene.state === user.homeSceneState &&
          scene.musicCommunity === user.homeSceneCommunity,
        }));

      return {
        tier,
        musicCommunity,
        filters: {
          state: stateFilter ?? null,
          city: cityFilter ?? null,
        },
        items,
      };
    }

    const byState = new Map<
      string,
      {
        state: string;
        citySceneCount: number;
        totalMembers: number;
        representativeSceneId: string | null;
      }
    >();

    for (const scene of cityScenes) {
      const state = scene.state ?? 'Unknown';
      const current = byState.get(state) ?? {
        state,
        citySceneCount: 0,
        totalMembers: 0,
        representativeSceneId: null,
      };
      current.citySceneCount += 1;
      current.totalMembers += scene.memberCount;
      if (!current.representativeSceneId) current.representativeSceneId = scene.id;
      byState.set(state, current);
    }

    const items: DiscoverStateRollupItem[] = Array.from(byState.values())
      .sort((a, b) => {
        if (b.totalMembers !== a.totalMembers) return b.totalMembers - a.totalMembers;
        return a.state.localeCompare(b.state);
      })
      .slice(0, limit)
      .map((row) => ({
        entryType: 'state_rollup',
        state: row.state,
        musicCommunity,
        citySceneCount: row.citySceneCount,
        totalMembers: row.totalMembers,
        representativeSceneId: row.representativeSceneId,
        isHomeSceneState:
          row.state === user.homeSceneState && musicCommunity === user.homeSceneCommunity,
      }));

    return {
      tier,
      musicCommunity,
      filters: {
        state: stateFilter ?? null,
        city: cityFilter ?? null,
      },
      items,
    };
  }

  /**
   * Resolve a tune request for a listener session without mutating Home Scene.
   * Home Scene remains the civic anchor; this only sets listening context.
   */
  async tuneScene(userId: string, dto: PostDiscoverTuneDto) {
    const [user, tunedScene] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          homeSceneCity: true,
          homeSceneState: true,
          homeSceneCommunity: true,
        },
      }),
      this.prisma.community.findUnique({
        where: { id: dto.sceneId },
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          musicCommunity: true,
          tier: true,
          isActive: true,
        },
      }),
    ]);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!tunedScene) {
      throw new NotFoundException(`Community with ID ${dto.sceneId} not found`);
    }

    let homeSceneId: string | null = null;
    if (user.homeSceneCity && user.homeSceneState && user.homeSceneCommunity) {
      const homeScene = await this.prisma.community.findFirst({
        where: {
          city: user.homeSceneCity,
          state: user.homeSceneState,
          musicCommunity: user.homeSceneCommunity,
          tier: 'city',
        },
        select: { id: true },
      });
      homeSceneId = homeScene?.id ?? null;
    }

    const isVisitor = homeSceneId ? homeSceneId !== tunedScene.id : true;

    return {
      tunedSceneId: tunedScene.id,
      tunedScene: {
        id: tunedScene.id,
        name: tunedScene.name,
        city: tunedScene.city,
        state: tunedScene.state,
        musicCommunity: tunedScene.musicCommunity,
        tier: tunedScene.tier,
        isActive: tunedScene.isActive,
      },
      homeSceneId,
      isVisitor,
    };
  }

  /**
   * Explicitly set Home Scene from discovery context.
   * Guardrails:
   * - Target must be a city-tier scene.
   * - Cross-state switches are rejected when user already has a Home Scene state.
   */
  async setHomeScene(userId: string, dto: PostDiscoverSetHomeSceneDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        homeSceneCity: true,
        homeSceneState: true,
        homeSceneCommunity: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const scene = await this.prisma.community.findUnique({
      where: { id: dto.sceneId },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        musicCommunity: true,
        tier: true,
        isActive: true,
      },
    });

    if (!scene) {
      throw new NotFoundException(`Community with ID ${dto.sceneId} not found`);
    }

    if (scene.tier !== 'city') {
      throw new BadRequestException('Home Scene can only be set to a city-tier scene');
    }

    if (user.homeSceneState && scene.state && user.homeSceneState !== scene.state) {
      throw new BadRequestException('Home Scene switch must stay within your current home state');
    }

    let previousHomeSceneId: string | null = null;
    if (user.homeSceneCity && user.homeSceneState && user.homeSceneCommunity) {
      const previousHome = await this.prisma.community.findFirst({
        where: {
          city: user.homeSceneCity,
          state: user.homeSceneState,
          musicCommunity: user.homeSceneCommunity,
          tier: 'city',
        },
        select: { id: true },
      });
      previousHomeSceneId = previousHome?.id ?? null;
    }

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          homeSceneCity: scene.city,
          homeSceneState: scene.state,
          homeSceneCommunity: scene.musicCommunity,
        },
      });

      try {
        await tx.communityMember.create({
          data: { userId, communityId: scene.id, role: 'member' },
        });
        await tx.community.update({
          where: { id: scene.id },
          data: { memberCount: { increment: 1 } },
        });
      } catch (error: any) {
        if (error?.code !== 'P2002') throw error;
      }
    });

    return {
      previousHomeSceneId,
      homeSceneId: scene.id,
      homeScene: scene,
      changed: previousHomeSceneId !== scene.id,
    };
  }

  /**
   * Resolve a city-tier community by exact Home Scene tuple.
   * Returns null when no match exists.
   */
  async resolveHomeCommunity(query: ResolveHomeCommunityDto) {
    const city = query.city.trim();
    const state = query.state.trim();
    const musicCommunity = query.musicCommunity.trim();

    const community = await this.prisma.community.findFirst({
      where: {
        city,
        state,
        musicCommunity,
        tier: 'city',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        memberCount: true,
        city: true,
        state: true,
        musicCommunity: true,
        tier: true,
        isActive: true,
      },
      orderBy: [{ isActive: 'desc' }, { createdAt: 'asc' }],
    });

    return community;
  }

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

  /**
   * Scene-scoped S.E.E.D feed projection.
   * Explicit actions/events only; no personalization.
   */
  async getFeed(communityId: string, query: GetCommunityFeedDto) {
    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true },
    });

    if (!community) {
      throw new NotFoundException(`Community with ID ${communityId} not found`);
    }

    const limit = query.limit ?? 50;
    const before = query.before ?? new Date();
    const perSourceTake = Math.min(Math.max(limit * 2, 20), 200);

    const [blastActions, trackReleases, eventCreates, signalCreates] = await Promise.all([
      this.prisma.signalAction.findMany({
        where: {
          type: 'BLAST',
          createdAt: { lte: before },
          signal: { communityId },
        },
        orderBy: { createdAt: 'desc' },
        take: perSourceTake,
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatar: true },
          },
          signal: {
            select: { id: true, type: true, metadata: true },
          },
        },
      }),
      this.prisma.track.findMany({
        where: { communityId, status: 'ready', createdAt: { lte: before } },
        orderBy: { createdAt: 'desc' },
        take: perSourceTake,
        include: {
          uploadedBy: {
            select: { id: true, username: true, displayName: true, avatar: true },
          },
        },
      }),
      this.prisma.event.findMany({
        where: { communityId, createdAt: { lte: before } },
        orderBy: { createdAt: 'desc' },
        take: perSourceTake,
        include: {
          createdBy: {
            select: { id: true, username: true, displayName: true, avatar: true },
          },
        },
      }),
      this.prisma.signal.findMany({
        where: { communityId, createdAt: { lte: before } },
        orderBy: { createdAt: 'desc' },
        take: perSourceTake,
        include: {
          createdBy: {
            select: { id: true, username: true, displayName: true, avatar: true },
          },
        },
      }),
    ]);

    const feedItems: CommunityFeedItem[] = [
      ...blastActions.map((action: any) => ({
        id: `blast:${action.id}`,
        type: 'blast' as const,
        occurredAt: action.createdAt,
        actor: action.user,
        entity: { type: 'signal' as const, id: action.signalId },
        metadata: {
          signalType: action.signal.type,
          signalMetadata: action.signal.metadata as Record<string, unknown> | null,
        },
      })),
      ...trackReleases.map((track: any) => ({
        id: `track_release:${track.id}`,
        type: 'track_release' as const,
        occurredAt: track.createdAt,
        actor: track.uploadedBy,
        entity: { type: 'track' as const, id: track.id },
        metadata: {
          title: track.title,
          artist: track.artist,
          duration: track.duration,
        },
      })),
      ...eventCreates.map((event: any) => ({
        id: `event_created:${event.id}`,
        type: 'event_created' as const,
        occurredAt: event.createdAt,
        actor: event.createdBy,
        entity: { type: 'event' as const, id: event.id },
        metadata: {
          title: event.title,
          startDate: event.startDate.toISOString(),
          locationName: event.locationName,
        },
      })),
      ...signalCreates.map((signal: any) => ({
        id: `signal_created:${signal.id}`,
        type: 'signal_created' as const,
        occurredAt: signal.createdAt,
        actor: signal.createdBy ?? null,
        entity: { type: 'signal' as const, id: signal.id },
        metadata: {
          signalType: signal.type,
          signalMetadata: signal.metadata as Record<string, unknown> | null,
        },
      })),
    ];

    feedItems.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());

    const items = feedItems.slice(0, limit);
    const nextCursor = items.length === limit ? items[items.length - 1].occurredAt.toISOString() : null;

    return {
      items,
      limit,
      nextCursor,
    };
  }

  /**
   * Scene-scoped events listing for Plot Events tab.
   * Deterministic ordering; no personalization.
   */
  async getEvents(communityId: string, query: GetCommunityEventsDto) {
    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true },
    });

    if (!community) {
      throw new NotFoundException(`Community with ID ${communityId} not found`);
    }

    const limit = query.limit ?? 20;
    const includePast = query.includePast ?? false;
    const now = new Date();

    const where = includePast
      ? { communityId }
      : {
          communityId,
          endDate: { gte: now },
        };

    const events = await this.prisma.event.findMany({
      where,
      orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }],
      take: limit,
      include: {
        createdBy: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    const items: CommunityEventItem[] = events.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      locationName: event.locationName,
      address: event.address,
      attendeeCount: event.attendeeCount,
      maxAttendees: event.maxAttendees,
      createdAt: event.createdAt.toISOString(),
      createdBy: event.createdBy ?? null,
    }));

    return {
      items,
      limit,
      includePast,
    };
  }

  /**
   * Scene-scoped promotions/offers listing.
   * Interim read model backed by Signal types (PROMOTION/OFFER).
   */
  async getPromotions(communityId: string, query: GetCommunityPromotionsDto) {
    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true },
    });

    if (!community) {
      throw new NotFoundException(`Community with ID ${communityId} not found`);
    }

    const limit = query.limit ?? 20;

    const promotions = await this.prisma.signal.findMany({
      where: {
        communityId,
        type: { in: ['PROMOTION', 'OFFER'] },
      },
      orderBy: [{ createdAt: 'desc' }],
      take: limit,
      include: {
        createdBy: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    const items: CommunityPromotionItem[] = promotions.map((promotion: any) => ({
      id: promotion.id,
      type: promotion.type,
      createdAt: promotion.createdAt.toISOString(),
      actor: promotion.createdBy ?? null,
      metadata: (promotion.metadata as Record<string, unknown> | null) ?? null,
    }));

    return {
      items,
      limit,
    };
  }

  async getStatistics(communityId: string, query: GetCommunityStatisticsDto): Promise<CommunityStatistics> {
    const anchor = await this.prisma.community.findUnique({
      where: { id: communityId },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        musicCommunity: true,
        tier: true,
        isActive: true,
      },
    });

    if (!anchor) {
      throw new NotFoundException(`Community with ID ${communityId} not found`);
    }

    const tierScope = query.tier;
    const windowDays = 7;
    const windowStart = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

    const scopeWhere =
      tierScope === 'city'
        ? { id: anchor.id }
        : tierScope === 'state'
        ? {
            tier: 'city',
            state: anchor.state,
            musicCommunity: anchor.musicCommunity,
          }
        : {
            tier: 'city',
            musicCommunity: anchor.musicCommunity,
          };

    const scopeCommunities: ScopeCommunity[] = await this.prisma.community.findMany({
      where: scopeWhere,
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        memberCount: true,
      },
    });

    const scopeCommunityIds = scopeCommunities.map((c: { id: string }) => c.id);
    const totalMembers = scopeCommunities.reduce(
      (sum: number, c: { memberCount: number }) => sum + c.memberCount,
      0
    );

    const [activeSects, eventsThisWeek, activityScore, activeTracks, topSongs] =
      scopeCommunityIds.length === 0
        ? [0, 0, 0, 0, [] as Array<{
            id: string;
            title: string;
            artist: string;
            duration: number;
            playCount: number;
            communityId: string | null;
            community: { name: string } | null;
          }>]
        : await Promise.all([
            this.prisma.sectTag.count({
              where: {
                status: 'active',
                parentCommunityId: { in: scopeCommunityIds },
              },
            }),
            this.prisma.event.count({
              where: {
                communityId: { in: scopeCommunityIds },
                createdAt: { gte: windowStart },
              },
            }),
            this.prisma.signalAction.count({
              where: {
                createdAt: { gte: windowStart },
                signal: {
                  communityId: { in: scopeCommunityIds },
                },
              },
            }),
            this.prisma.track.count({
              where: {
                communityId: { in: scopeCommunityIds },
                status: 'ready',
              },
            }),
            this.prisma.track.findMany({
              where: {
                communityId: { in: scopeCommunityIds },
                status: 'ready',
              },
              select: {
                id: true,
                title: true,
                artist: true,
                duration: true,
                playCount: true,
                communityId: true,
                community: { select: { name: true } },
              },
              orderBy: [{ playCount: 'desc' }, { createdAt: 'desc' }],
              take: 40,
            }),
          ]);

    const gpsVerifiedUsers =
      tierScope === 'city'
        ? await this.prisma.user.count({
            where: {
              gpsVerified: true,
              homeSceneCity: anchor.city,
              homeSceneState: anchor.state,
              homeSceneCommunity: anchor.musicCommunity,
            },
          })
        : tierScope === 'state'
        ? await this.prisma.user.count({
            where: {
              gpsVerified: true,
              homeSceneState: anchor.state,
              homeSceneCommunity: anchor.musicCommunity,
            },
          })
        : await this.prisma.user.count({
            where: {
              gpsVerified: true,
              homeSceneCommunity: anchor.musicCommunity,
            },
          });

    return {
      community: anchor,
      tierScope,
      rollupUnit: tierScope === 'city' ? 'local_sect' : tierScope === 'state' ? 'city' : 'state',
      metrics: {
        totalMembers,
        activeSects,
        eventsThisWeek,
        activityScore,
        activeTracks,
        gpsVerifiedUsers,
        votingEligibleUsers: gpsVerifiedUsers,
        scopeCommunityCount: scopeCommunities.length,
      },
      topSongs: topSongs.map((song: {
        id: string;
        title: string;
        artist: string;
        duration: number;
        playCount: number;
        communityId: string | null;
        community: { name: string } | null;
      }) => ({
        trackId: song.id,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        playCount: song.playCount,
        communityId: song.communityId,
        communityName: song.community?.name ?? null,
      })),
      timeWindow: {
        days: windowDays,
        asOf: new Date().toISOString(),
      },
    };
  }

  async getSceneMap(communityId: string, query: GetCommunitySceneMapDto): Promise<CommunitySceneMap> {
    const anchor = await this.prisma.community.findUnique({
      where: { id: communityId },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        musicCommunity: true,
      },
    });

    if (!anchor) {
      throw new NotFoundException(`Community with ID ${communityId} not found`);
    }

    const tierScope = query.tier;
    const rollupUnit = tierScope === 'city' ? 'local_sect' : tierScope === 'state' ? 'city' : 'state';
    const windowDays = 7;
    const windowStart = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

    const scopeWhere =
      tierScope === 'city'
        ? { id: anchor.id }
        : tierScope === 'state'
        ? {
            tier: 'city',
            state: anchor.state,
            musicCommunity: anchor.musicCommunity,
          }
        : {
            tier: 'city',
            musicCommunity: anchor.musicCommunity,
          };

    const scopeCommunities = await this.prisma.community.findMany({
      where: scopeWhere,
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        memberCount: true,
      },
    });

    if (scopeCommunities.length === 0) {
      return {
        community: anchor,
        tierScope,
        rollupUnit,
        center: null,
        points: [],
        timeWindow: {
          days: windowDays,
          asOf: new Date().toISOString(),
        },
      };
    }

    const scopeCommunityIds = scopeCommunities.map((c: ScopeCommunity) => c.id);
    const communityIndex = new Map<string, ScopeCommunity>(
      scopeCommunities.map((c: ScopeCommunity) => [c.id, c])
    );

    const [geoRows, activeTrackRows, activeSectRows, eventRows] = await Promise.all([
      Promise.all(
        scopeCommunityIds.map(async (id: string) => {
          const row = await this.prisma.$queryRaw<Array<{ id: string; lat: number | null; lng: number | null }>>`
            SELECT id::text as id, ST_Y(geofence::geometry) as lat, ST_X(geofence::geometry) as lng
            FROM communities
            WHERE id = ${id}::uuid
          `;
          return row[0] ?? { id, lat: null, lng: null };
        })
      ),
      this.prisma.track.groupBy({
        by: ['communityId'],
        where: {
          communityId: { in: scopeCommunityIds },
          status: 'ready',
        },
        _count: { _all: true },
      }),
      this.prisma.sectTag.groupBy({
        by: ['parentCommunityId'],
        where: {
          parentCommunityId: { in: scopeCommunityIds },
          status: 'active',
        },
        _count: { _all: true },
      }),
      this.prisma.event.groupBy({
        by: ['communityId'],
        where: {
          communityId: { in: scopeCommunityIds },
          createdAt: { gte: windowStart },
        },
        _count: { _all: true },
      }),
    ]);

    const geoIndex = new Map<string, { id: string; lat: number | null; lng: number | null }>(
      geoRows.map((row: { id: string; lat: number | null; lng: number | null }) => [row.id, row])
    );
    const trackIndex = new Map<string, number>(
      activeTrackRows
        .filter(
          (row: { communityId: string | null; _count: { _all: number } }): row is {
            communityId: string;
            _count: { _all: number };
          } => row.communityId !== null
        )
        .map((row: { communityId: string; _count: { _all: number } }) => [row.communityId, row._count._all])
    );
    const sectIndex = new Map<string, number>(
      activeSectRows.map((row: { parentCommunityId: string; _count: { _all: number } }) => [
        row.parentCommunityId,
        row._count._all,
      ])
    );
    const eventIndex = new Map<string, number>(
      eventRows.map((row: { communityId: string; _count: { _all: number } }) => [row.communityId, row._count._all])
    );

    const basePoints = scopeCommunityIds.map((id: string): SceneMapPoint => {
      const community = communityIndex.get(id);
      const geo = geoIndex.get(id);

      return {
        id,
        label: community?.name ?? id,
        lat: geo?.lat ?? null,
        lng: geo?.lng ?? null,
        memberCount: community?.memberCount ?? 0,
        activeTracks: trackIndex.get(id) ?? 0,
        activeSects: sectIndex.get(id) ?? 0,
        eventsThisWeek: eventIndex.get(id) ?? 0,
        kind: 'community',
      };
    });

    const points =
      tierScope === 'city'
        ? basePoints
        : tierScope === 'state'
        ? this.rollupByLabel(basePoints, (p) => communityIndex.get(p.id)?.city ?? 'Unknown City', 'city')
        : this.rollupByLabel(basePoints, (p) => communityIndex.get(p.id)?.state ?? 'Unknown State', 'state');

    const center = this.computeCenter(points);

    return {
      community: anchor,
      tierScope,
      rollupUnit,
      center,
      points,
      timeWindow: {
        days: windowDays,
        asOf: new Date().toISOString(),
      },
    };
  }

  private rollupByLabel(
    points: SceneMapPoint[],
    labelFn: (point: SceneMapPoint) => string,
    kind: 'city' | 'state'
  ): SceneMapPoint[] {
    const grouped = new Map<string, SceneMapPoint[]>();

    for (const point of points) {
      const key = labelFn(point);
      const current = grouped.get(key) ?? [];
      current.push(point);
      grouped.set(key, current);
    }

    return Array.from(grouped.entries()).map(([label, group]) => {
      const latValues = group.map((g) => g.lat).filter((lat): lat is number => lat !== null);
      const lngValues = group.map((g) => g.lng).filter((lng): lng is number => lng !== null);

      const sum = group.reduce(
        (acc, g) => ({
          memberCount: acc.memberCount + g.memberCount,
          activeTracks: acc.activeTracks + g.activeTracks,
          activeSects: acc.activeSects + g.activeSects,
          eventsThisWeek: acc.eventsThisWeek + g.eventsThisWeek,
        }),
        { memberCount: 0, activeTracks: 0, activeSects: 0, eventsThisWeek: 0 }
      );

      return {
        id: `${kind}:${label}`,
        label,
        lat: latValues.length > 0 ? latValues.reduce((a, b) => a + b, 0) / latValues.length : null,
        lng: lngValues.length > 0 ? lngValues.reduce((a, b) => a + b, 0) / lngValues.length : null,
        memberCount: sum.memberCount,
        activeTracks: sum.activeTracks,
        activeSects: sum.activeSects,
        eventsThisWeek: sum.eventsThisWeek,
        kind,
      };
    });
  }

  private computeCenter(points: SceneMapPoint[]): { lat: number; lng: number } | null {
    const latValues = points.map((p) => p.lat).filter((lat): lat is number => lat !== null);
    const lngValues = points.map((p) => p.lng).filter((lng): lng is number => lng !== null);

    if (latValues.length === 0 || lngValues.length === 0) {
      return null;
    }

    return {
      lat: latValues.reduce((a, b) => a + b, 0) / latValues.length,
      lng: lngValues.reduce((a, b) => a + b, 0) / lngValues.length,
    };
  }
}
