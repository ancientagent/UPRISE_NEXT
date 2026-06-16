import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { EventsService } from './events.service';
import {
  CreatePrintShopEventSchema,
  type CreatePrintShopEventDto,
} from './dto/create-print-shop-event.dto';

@Controller('print-shop')
@UseGuards(JwtAuthGuard)
export class PrintShopController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('events')
  @ZodBody(CreatePrintShopEventSchema)
  async createEvent(
    @Body() dto: CreatePrintShopEventDto,
    @Request() req: { user: { userId: string } },
  ) {
    const event = await this.eventsService.createFromPrintShop(req.user.userId, dto);
    return { success: true, data: event };
  }
}
