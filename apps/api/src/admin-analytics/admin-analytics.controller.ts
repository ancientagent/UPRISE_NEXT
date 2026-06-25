import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminAnalyticsService } from './admin-analytics.service';

type ActivateReadyCommunityBody = {
  city: string;
  state: string;
  musicCommunity: string;
};

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard)
export class AdminAnalyticsController {
  constructor(private readonly adminAnalyticsService: AdminAnalyticsService) {}

  @Get('query')
  async queryAnalytics() {
    return this.adminAnalyticsService.queryAnalytics();
  }

  @Get('activation-readiness')
  async getActivationReadinessDiagnostics() {
    return this.adminAnalyticsService.getActivationReadinessDiagnostics();
  }

  @Post('activation-readiness/activate')
  async activateReadyCommunity(@Body() body: ActivateReadyCommunityBody) {
    return this.adminAnalyticsService.activateReadyCommunity(body);
  }
}
