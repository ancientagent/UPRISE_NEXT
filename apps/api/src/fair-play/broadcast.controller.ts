import { BadRequestException, Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FairPlayService } from './fair-play.service';

@Controller('broadcast')
@UseGuards(JwtAuthGuard)
export class BroadcastController {
  constructor(private readonly fairPlayService: FairPlayService) {}

  private normalizeRequestedTier(rawTier?: string): 'city' | 'state' | 'national' | undefined {
    if (!rawTier) return undefined;
    if (rawTier === 'city' || rawTier === 'state' || rawTier === 'national') {
      return rawTier;
    }

    throw new BadRequestException({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Tier must be city, state, or national' },
    });
  }

  @Get('rotation')
  async getActiveRotation(
    @Request() req: { user: { userId: string } },
    @Query('tier') rawTier?: string,
  ) {
    return this.fairPlayService.getActiveRotation(
      req.user.userId,
      this.normalizeRequestedTier(rawTier),
    );
  }

  @Get(':sceneId/rotation')
  async getRotation(@Param('sceneId') sceneId: string, @Query('tier') rawTier?: string) {
    return this.fairPlayService.getRotation(sceneId, this.normalizeRequestedTier(rawTier));
  }
}
