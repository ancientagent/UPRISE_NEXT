
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
  CreateCommunityWithGeoDto,
  VerifyLocationDto,
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
