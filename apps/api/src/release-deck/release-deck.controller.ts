import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { ZodQuery } from '../common/decorators/zod-query.decorator';
import { ReleaseDeckMeasurementService } from './release-deck-measurement.service';
import {
  ReleaseDeckMeasurementQuerySchema,
  ReleaseDeckMeasurementQueryDto,
} from './dto/release-deck-measurement.dto';
import {
  ReleaseDeckScheduleAvailabilityQuerySchema,
  ReleaseDeckScheduleAvailabilityQueryDto,
  ReleaseDeckScheduleCreateSchema,
  ReleaseDeckScheduleCreateDto,
} from './dto/release-deck-schedule.dto';
import { ReleaseDeckSchedulingService } from './release-deck-scheduling.service';

/**
 * Release Deck measurement, schedule availability, and source-operator writes.
 *
 * Scheduling diagnostics and writes are limited to the source operator. The
 * scheduling service verifies authority for both operations.
 */
@Controller('release-deck')
@UseGuards(JwtAuthGuard)
export class ReleaseDeckController {
  constructor(
    private readonly releaseDeckMeasurementService: ReleaseDeckMeasurementService,
    private readonly releaseDeckSchedulingService: ReleaseDeckSchedulingService
  ) {}

  @Get('measurement')
  async getMeasurement(
    @ZodQuery(ReleaseDeckMeasurementQuerySchema) query: ReleaseDeckMeasurementQueryDto
  ) {
    return this.releaseDeckMeasurementService.measureCommunityDeck(query.communityId);
  }

  @Get('schedule/availability')
  async getScheduleAvailability(
    @ZodQuery(ReleaseDeckScheduleAvailabilityQuerySchema)
    query: ReleaseDeckScheduleAvailabilityQueryDto,
    @Request() req: { user: { userId: string } }
  ) {
    return this.releaseDeckSchedulingService.getAvailability(query, req.user.userId);
  }

  @Post('schedule')
  @HttpCode(HttpStatus.CREATED)
  @ZodBody(ReleaseDeckScheduleCreateSchema)
  async scheduleTrack(
    @Body() dto: ReleaseDeckScheduleCreateDto,
    @Request() req: { user: { userId: string } }
  ) {
    return this.releaseDeckSchedulingService.scheduleTrack(req.user.userId, dto);
  }
}
