import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FairPlayService } from './fair-play.service';

@Controller('broadcast')
@UseGuards(JwtAuthGuard)
export class BroadcastController {
  constructor(private readonly fairPlayService: FairPlayService) {}

  @Get(':sceneId/rotation')
  async getRotation(@Param('sceneId') sceneId: string) {
    return this.fairPlayService.getRotation(sceneId);
  }
}
