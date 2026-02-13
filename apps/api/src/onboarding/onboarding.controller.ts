import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { OnboardingService } from './onboarding.service';
import {
  HomeSceneSelectionSchema,
  HomeSceneSelectionDto,
  GpsVerifySchema,
  GpsVerifyDto,
} from './dto/onboarding.dto';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @Post('home-scene')
  @ZodBody(HomeSceneSelectionSchema)
  async setHomeScene(@Body() dto: HomeSceneSelectionDto, @Request() req: any) {
    const result = await this.onboardingService.setHomeScene(req.user.userId, dto);
    return { success: true, data: result };
  }

  @Post('gps-verify')
  @ZodBody(GpsVerifySchema)
  async verifyGps(@Body() dto: GpsVerifyDto, @Request() req: any) {
    const result = await this.onboardingService.verifyGps(req.user.userId, dto);
    return { success: true, data: result };
  }
}
