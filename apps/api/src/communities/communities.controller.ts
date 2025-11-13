
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
} from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateCommunityWithGeoSchema,
  FindNearbyCommunitiesSchema,
  VerifyLocationSchema,
  CreateCommunityWithGeoDto,
  FindNearbyCommunitiesDto,
  VerifyLocationDto,
} from './dto/community.dto';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { ZodQuery } from '../common/decorators/zod-query.decorator';

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
  @Get('nearby/search')
  @ZodQuery(FindNearbyCommunitiesSchema)
  async findNearby(@Query() query: FindNearbyCommunitiesDto) {
    const communities = await this.communitiesService.findNearby({
      lat: +query.lat,
      lng: +query.lng,
      radius: query.radius ? +query.radius : 5000,
      limit: query.limit ? +query.limit : 20,
    });

    return {
      success: true,
      data: communities,
      meta: {
        searchLocation: { lat: query.lat, lng: query.lng },
        radius: query.radius || 5000,
        count: communities.length,
      },
    };
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
