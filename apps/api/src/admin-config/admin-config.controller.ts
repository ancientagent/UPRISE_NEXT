import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { AdminConfigService } from './admin-config.service';
import { UpdateFairPlayConfigSchema, type UpdateFairPlayConfigDto } from './dto/fair-play-config.dto';

@Controller('admin/config')
@UseGuards(JwtAuthGuard)
export class AdminConfigController {
  constructor(private readonly adminConfigService: AdminConfigService) {}

  @Get('fair-play')
  async getFairPlayConfig() {
    return this.adminConfigService.getFairPlayConfig();
  }

  @Post('fair-play')
  @HttpCode(HttpStatus.OK)
  @ZodBody(UpdateFairPlayConfigSchema)
  async updateFairPlayConfig(@Body() dto: UpdateFairPlayConfigDto) {
    return this.adminConfigService.updateFairPlayConfig(dto);
  }
}
