import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FairPlayService } from './fair-play.service';

@Controller('fair-play')
@UseGuards(JwtAuthGuard)
export class FairPlayMetricsController {
  constructor(private readonly fairPlayService: FairPlayService) {}

  @Get('metrics')
  async metrics(@Query('sceneId') sceneId: string) {
    return this.fairPlayService.getMetrics(sceneId);
  }
}
