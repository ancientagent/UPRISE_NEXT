
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    const result = await this.eventsService.findMany(+page, +limit);
    return {
      success: true,
      data: result.events,
      meta: { page: result.page, limit: result.limit, total: result.total },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findById(id);
    return { success: true, data: event };
  }
}
