import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Request,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommunitiesService } from './communities.service';
import {
  GetDiscoverScenesDto,
  GetDiscoverScenesSchema,
  PostDiscoverTuneDto,
  PostDiscoverTuneSchema,
} from './dto/community.dto';
import { ZodBody } from '../common/decorators/zod-body.decorator';

@Controller('discover')
@UseGuards(JwtAuthGuard)
export class DiscoveryController {
  constructor(private communitiesService: CommunitiesService) {}

  /**
   * GET /api/discover/scenes
   * Deterministic scene discovery list by scope + music community.
   */
  @Get('scenes')
  async discoverScenes(
    @Query() rawQuery: any,
    @Request() req: { user: { userId: string } }
  ): Promise<{
    success: true;
    data: any[];
    meta: {
      tier: 'city' | 'state' | 'national';
      musicCommunity: string;
      filters: { state: string | null; city: string | null };
      count: number;
    };
  }> {
    try {
      const query: GetDiscoverScenesDto = GetDiscoverScenesSchema.parse({
        tier: rawQuery.tier,
        musicCommunity: rawQuery.musicCommunity,
        state: rawQuery.state,
        city: rawQuery.city,
        limit: rawQuery.limit,
      });

      const result = await this.communitiesService.discoverScenes(req.user.userId, query);

      return {
        success: true,
        data: result.items,
        meta: {
          tier: result.tier,
          musicCommunity: result.musicCommunity,
          filters: result.filters,
          count: result.items.length,
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
   * POST /api/discover/tune
   * Set listener tuned scene context (visitor-safe; does not change Home Scene).
   */
  @Post('tune')
  @HttpCode(HttpStatus.OK)
  @ZodBody(PostDiscoverTuneSchema)
  async tuneScene(
    @Body() dto: PostDiscoverTuneDto,
    @Request() req: { user: { userId: string } }
  ): Promise<{
    success: true;
    data: {
      tunedSceneId: string;
      tunedScene: {
        id: string;
        name: string;
        city: string | null;
        state: string | null;
        musicCommunity: string | null;
        tier: string;
        isActive: boolean;
      };
      homeSceneId: string | null;
      isVisitor: boolean;
    };
  }> {
    const result = await this.communitiesService.tuneScene(req.user.userId, dto);
    return {
      success: true,
      data: result,
    };
  }
}
