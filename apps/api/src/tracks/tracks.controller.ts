
import { Controller, Get, Post, Param, Query, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { TrackEngageSchema, type TrackEngageDto } from './dto/track-engage.dto';

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

  /**
   * POST /tracks/:id/engage
   * Record engagement event (Canon: 3/2/1/0 model)
   */
  @Post(':id/engage')
  @HttpCode(HttpStatus.OK)
  @ZodBody(TrackEngageSchema)
  async engage(
    @Param('id') id: string,
    @Body() dto: TrackEngageDto,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.tracksService.recordEngagement(req.user.userId, id, dto);
    return result;
  }
}
