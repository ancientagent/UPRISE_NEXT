import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  Request,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CommunitiesService } from './communities.service';
import {
  GetCommunityDiscoverHighlightsDto,
  GetCommunityDiscoverHighlightsSchema,
  GetCommunityDiscoverSearchDto,
  GetCommunityDiscoverSearchSchema,
  GetDiscoverScenesDto,
  GetDiscoverScenesSchema,
  PostDiscoverSetHomeSceneDto,
  PostDiscoverSetHomeSceneSchema,
  PostDiscoverSaveUpriseDto,
  PostDiscoverSaveUpriseSchema,
  PostDiscoverTuneDto,
  PostDiscoverTuneSchema,
} from './dto/community.dto';
import { ZodBody } from '../common/decorators/zod-body.decorator';

@Controller('discover')
export class DiscoveryController {
  constructor(private communitiesService: CommunitiesService) {}

  /**
   * GET /api/discover/scenes
   * Deterministic scene discovery list by scope + music community.
  */
  @Get('scenes')
  @UseGuards(OptionalJwtAuthGuard)
  async discoverScenes(
    @Query() rawQuery: any,
    @Request() req: { user?: { userId: string } | null }
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

      const result = await this.communitiesService.discoverScenes(req.user?.userId ?? null, query);

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

  @Get('communities/:sceneId/search')
  @UseGuards(JwtAuthGuard)
  async searchCommunityDiscover(
    @Param('sceneId') sceneId: string,
    @Query() rawQuery: any,
    @Request() req: { user: { userId: string } },
  ): Promise<{
    success: true;
    data: any;
  }> {
    try {
      const query: GetCommunityDiscoverSearchDto = GetCommunityDiscoverSearchSchema.parse({
        query: rawQuery.query,
        limit: rawQuery.limit,
      });

      const result = await this.communitiesService.searchCommunityDiscover(
        req.user.userId,
        sceneId,
        query,
      );

      return {
        success: true,
        data: result,
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

  @Get('communities/:sceneId/highlights')
  @UseGuards(JwtAuthGuard)
  async getCommunityDiscoverHighlights(
    @Param('sceneId') sceneId: string,
    @Query() rawQuery: any,
    @Request() req: { user: { userId: string } },
  ): Promise<{
    success: true;
    data: any;
  }> {
    try {
      const query: GetCommunityDiscoverHighlightsDto = GetCommunityDiscoverHighlightsSchema.parse({
        limit: rawQuery.limit,
      });

      const result = await this.communitiesService.getCommunityDiscoverHighlights(
        req.user.userId,
        sceneId,
        query,
      );

      return {
        success: true,
        data: result,
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
  @UseGuards(JwtAuthGuard)
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

  /**
   * GET /api/discover/context
   * Get persisted tuned-scene context for current user.
  */
  @Get('context')
  @UseGuards(OptionalJwtAuthGuard)
  async getContext(
    @Request() req: { user?: { userId: string } | null }
  ): Promise<{
    success: true;
    data: {
      tunedSceneId: string | null;
      tunedScene: {
        id: string;
        name: string;
        city: string | null;
        state: string | null;
        musicCommunity: string | null;
        tier: string;
        isActive: boolean;
      } | null;
      homeSceneId: string | null;
      isVisitor: boolean;
    };
  }> {
    const result = await this.communitiesService.getDiscoveryContext(req.user?.userId ?? null);
    return {
      success: true,
      data: result,
    };
  }

  /**
   * POST /api/discover/set-home-scene
   * Explicit Home Scene reassignment from discovery context.
   */
  @Post('set-home-scene')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ZodBody(PostDiscoverSetHomeSceneSchema)
  async setHomeScene(
    @Body() dto: PostDiscoverSetHomeSceneDto,
    @Request() req: { user: { userId: string } }
  ): Promise<{
    success: true;
    data: {
      previousHomeSceneId: string | null;
      homeSceneId: string;
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
      isVisitor: boolean;
      homeScene: {
        id: string;
        name: string;
        city: string | null;
        state: string | null;
        musicCommunity: string | null;
        tier: string;
        isActive: boolean;
      };
      changed: boolean;
    };
  }> {
    const result = await this.communitiesService.setHomeScene(req.user.userId, dto);
    return {
      success: true,
      data: result,
    };
  }

  @Post('save-uprise')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ZodBody(PostDiscoverSaveUpriseSchema)
  async saveUprise(
    @Body() dto: PostDiscoverSaveUpriseDto,
    @Request() req: { user: { userId: string } },
  ): Promise<{
    success: true;
    data: any;
  }> {
    const result = await this.communitiesService.saveDiscoverUprise(req.user.userId, dto);
    return {
      success: true,
      data: result,
    };
  }
}
