import { Controller, Get, Query, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { ZodError } from 'zod';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommunitiesService } from './communities.service';
import { GetDiscoverScenesDto, GetDiscoverScenesSchema } from './dto/community.dto';

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
}
