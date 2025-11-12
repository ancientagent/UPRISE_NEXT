
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tracks')
@UseGuards(JwtAuthGuard)
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    const result = await this.tracksService.findMany(+page, +limit);
    return {
      success: true,
      data: result.tracks,
      meta: { page: result.page, limit: result.limit, total: result.total },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const track = await this.tracksService.findById(id);
    return { success: true, data: track };
  }
}
