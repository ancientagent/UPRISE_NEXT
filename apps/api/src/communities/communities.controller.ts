
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateCommunityWithGeoSchema,
  FindNearbyCommunitiesSchema,
  VerifyLocationSchema,
  GetCommunityFeedSchema,
  GetCommunityStatisticsSchema,
  GetCommunitySceneMapSchema,
  GetCommunityEventsSchema,
  GetCommunityPromotionsSchema,
  ResolveHomeCommunitySchema,
  CreateCommunityWithGeoDto,
  VerifyLocationDto,
  GetCommunityFeedDto,
  GetCommunityStatisticsDto,
  GetCommunitySceneMapDto,
  GetCommunityEventsDto,
  GetCommunityPromotionsDto,
  ResolveHomeCommunityDto,
} from './dto/community.dto';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { ZodError } from 'zod';

@Controller('communities')
@UseGuards(JwtAuthGuard)
export class CommunitiesController {
  constructor(private communitiesService: CommunitiesService) {}

  /**
   * GET /api/communities
   * List all communities with pagination
   */
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    const result = await this.communitiesService.findMany(+page, +limit);
    return {
      success: true,
      data: result.communities,
      meta: { page: result.page, limit: result.limit, total: result.total },
    };
  }

  /**
   * GET /api/communities/resolve-home
   * Resolve exact Home Scene tuple to a city-tier community anchor.
   */
  @Get('resolve-home')
  async resolveHome(@Query() rawQuery: any): Promise<{ success: true; data: any | null }> {
    try {
      const query: ResolveHomeCommunityDto = ResolveHomeCommunitySchema.parse({
        city: rawQuery.city,
        state: rawQuery.state,
        musicCommunity: rawQuery.musicCommunity,
      });

      const result = await this.communitiesService.resolveHomeCommunity(query);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  }

  /**
   * GET /api/communities/active/feed
   * Active-scene S.E.E.D feed (tuned scene first, Home Scene fallback)
   */
  @Get('active/feed')
  async getActiveFeed(
    @Request() req: { user: { userId: string } },
    @Query() rawQuery: any,
  ): Promise<{ success: true; data: any[]; meta: { limit: number; nextCursor: string | null; sceneId: string } }> {
    try {
      const query: GetCommunityFeedDto = GetCommunityFeedSchema.parse({
        limit: rawQuery.limit,
        before: rawQuery.before,
      });

      const sceneId = await this.communitiesService.resolveActiveSceneId(req.user.userId);
      const result = await this.communitiesService.getFeed(sceneId, query);
      return {
        success: true,
        data: result.items,
        meta: {
          sceneId,
          limit: result.limit,
          nextCursor: result.nextCursor,
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  }

  /**
   * GET /api/communities/active/statistics
   * Active-scene statistics (tuned scene first, Home Scene fallback)
   */
  @Get('active/statistics')
  async getActiveStatistics(@Request() req: { user: { userId: string } }, @Query() rawQuery: any) {
    try {
      const query: GetCommunityStatisticsDto = GetCommunityStatisticsSchema.parse({
        tier: rawQuery.tier,
      });

      const sceneId = await this.communitiesService.resolveActiveSceneId(req.user.userId);
      const result = await this.communitiesService.getStatistics(sceneId, query);
      return { success: true, data: result, meta: { sceneId } };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  }

  /**
   * GET /api/communities/active/events
   * Active-scene events listing (tuned scene first, Home Scene fallback)
   */
  @Get('active/events')
  async getActiveEvents(
    @Request() req: { user: { userId: string } },
    @Query() rawQuery: any,
  ): Promise<{ success: true; data: any[]; meta: { limit: number; includePast: boolean; sceneId: string } }> {
    try {
      const query: GetCommunityEventsDto = GetCommunityEventsSchema.parse({
        limit: rawQuery.limit,
        includePast: rawQuery.includePast,
      });

      const sceneId = await this.communitiesService.resolveActiveSceneId(req.user.userId);
      const result = await this.communitiesService.getEvents(sceneId, query);
      return {
        success: true,
        data: result.items,
        meta: {
          sceneId,
          limit: result.limit,
          includePast: result.includePast,
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  }

  /**
   * GET /api/communities/active/promotions
   * Active-scene promotions listing (tuned scene first, Home Scene fallback)
   */
  @Get('active/promotions')
  async getActivePromotions(
    @Request() req: { user: { userId: string } },
    @Query() rawQuery: any,
  ): Promise<{ success: true; data: any[]; meta: { limit: number; sceneId: string } }> {
    try {
      const query: GetCommunityPromotionsDto = GetCommunityPromotionsSchema.parse({
        limit: rawQuery.limit,
      });

      const sceneId = await this.communitiesService.resolveActiveSceneId(req.user.userId);
      const result = await this.communitiesService.getPromotions(sceneId, query);
      return {
        success: true,
        data: result.items,
        meta: {
          sceneId,
          limit: result.limit,
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  }

  /**
   * GET /api/communities/:id/feed
   * Scene-scoped S.E.E.D feed (explicit actions only)
   */
  @Get(':id/feed')
  async getFeed(
    @Param('id') id: string,
    @Query() rawQuery: any,
  ): Promise<{ success: true; data: any[]; meta: { limit: number; nextCursor: string | null } }> {
    try {
      const query: GetCommunityFeedDto = GetCommunityFeedSchema.parse({
        limit: rawQuery.limit,
        before: rawQuery.before,
      });

      const result = await this.communitiesService.getFeed(id, query);
      return {
        success: true,
        data: result.items,
        meta: {
          limit: result.limit,
          nextCursor: result.nextCursor,
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  }

  /**
   * GET /api/communities/:id/statistics
   * Tier-scoped scene statistics summary (descriptive only)
   */
  @Get(':id/statistics')
  async getStatistics(@Param('id') id: string, @Query() rawQuery: any) {
    try {
      const query: GetCommunityStatisticsDto = GetCommunityStatisticsSchema.parse({
        tier: rawQuery.tier,
      });

      const result = await this.communitiesService.getStatistics(id, query);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  }

  /**
   * GET /api/communities/:id/scene-map
   * Tier-scoped scene map payload
   */
  @Get(':id/scene-map')
  async getSceneMap(@Param('id') id: string, @Query() rawQuery: any) {
    try {
      const query: GetCommunitySceneMapDto = GetCommunitySceneMapSchema.parse({
        tier: rawQuery.tier,
      });

      const result = await this.communitiesService.getSceneMap(id, query);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  }

  /**
   * GET /api/communities/:id/events
   * Scene-scoped events listing for Plot Events tab
   */
  @Get(':id/events')
  async getEvents(
    @Param('id') id: string,
    @Query() rawQuery: any,
  ): Promise<{ success: true; data: any[]; meta: { limit: number; includePast: boolean } }> {
    try {
      const query: GetCommunityEventsDto = GetCommunityEventsSchema.parse({
        limit: rawQuery.limit,
        includePast: rawQuery.includePast,
      });

      const result = await this.communitiesService.getEvents(id, query);
      return {
        success: true,
        data: result.items,
        meta: {
          limit: result.limit,
          includePast: result.includePast,
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  }

  /**
   * GET /api/communities/:id/promotions
   * Scene-scoped promotions/offers listing for Plot Promotions tab
   */
  @Get(':id/promotions')
  async getPromotions(
    @Param('id') id: string,
    @Query() rawQuery: any,
  ): Promise<{ success: true; data: any[]; meta: { limit: number } }> {
    try {
      const query: GetCommunityPromotionsDto = GetCommunityPromotionsSchema.parse({
        limit: rawQuery.limit,
      });

      const result = await this.communitiesService.getPromotions(id, query);
      return {
        success: true,
        data: result.items,
        meta: {
          limit: result.limit,
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  }

  /**
   * GET /api/communities/:id
   * Get community by ID with geospatial data
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const community = await this.communitiesService.findById(id);
    return { success: true, data: community };
  }

  /**
   * POST /api/communities
   * Create community with GPS coordinates and geofence radius
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodBody(CreateCommunityWithGeoSchema)
  async create(
    @Body() dto: CreateCommunityWithGeoDto,
    @Request() req: any
  ) {
    const community = await this.communitiesService.create({
      ...dto,
      createdById: req.user.userId,
    });
    return { success: true, data: community };
  }

  /**
   * GET /api/communities/nearby
   * Find communities within radius of given GPS coordinates
   * Query params: lat, lng, radius (optional, default 5000m), limit (optional)
   */
  @Get('nearby')
  async findNearby(@Query() rawQuery: any) {
    try {
      // Validate query params with Zod
      const query = FindNearbyCommunitiesSchema.parse({
        lat: +rawQuery.lat,
        lng: +rawQuery.lng,
        radius: rawQuery.radius ? +rawQuery.radius : 5000,
        limit: rawQuery.limit ? +rawQuery.limit : 20,
      });

      const communities = await this.communitiesService.findNearby({
        lat: query.lat,
        lng: query.lng,
        radius: query.radius,
        limit: query.limit,
      });

      return {
        success: true,
        data: communities,
        meta: {
          searchLocation: { lat: query.lat, lng: query.lng },
          radius: query.radius,
          count: communities.length,
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      throw error;
    }
  }

  /**
   * POST /api/communities/:id/verify-location
   * Verify if user is within community geofence
   * Body: { lat, lng }
   */
  @Post(':id/verify-location')
  @HttpCode(HttpStatus.OK)
  @ZodBody(VerifyLocationSchema)
  async verifyLocation(
    @Param('id') id: string,
    @Body() dto: VerifyLocationDto
  ) {
    const result = await this.communitiesService.verifyLocation(id, dto);
    return { success: true, data: result };
  }
}
