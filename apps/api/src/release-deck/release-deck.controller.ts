import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodQuery } from '../common/decorators/zod-query.decorator';
import { ReleaseDeckMeasurementService } from './release-deck-measurement.service';
import {
  ReleaseDeckMeasurementQuerySchema,
  ReleaseDeckMeasurementQueryDto,
} from './dto/release-deck-measurement.dto';

/**
 * Read-only Release Deck diagnostics.
 *
 * Auth is authenticated-only for now, matching the activation-readiness
 * diagnostics precedent in `AdminAnalyticsController`. Source-operator vs
 * admin scoping is deferred with the rest of RBAC.
 */
@Controller('release-deck')
@UseGuards(JwtAuthGuard)
export class ReleaseDeckController {
  constructor(private readonly releaseDeckMeasurementService: ReleaseDeckMeasurementService) {}

  @Get('measurement')
  async getMeasurement(@ZodQuery(ReleaseDeckMeasurementQuerySchema) query: ReleaseDeckMeasurementQueryDto) {
    return this.releaseDeckMeasurementService.measureCommunityDeck(query.communityId);
  }
}
