import { Module } from '@nestjs/common';
import { ReleaseDeckController } from './release-deck.controller';
import { ReleaseDeckMeasurementService } from './release-deck-measurement.service';
import { ReleaseDeckSchedulingService } from './release-deck-scheduling.service';

@Module({
  controllers: [ReleaseDeckController],
  providers: [ReleaseDeckMeasurementService, ReleaseDeckSchedulingService],
  exports: [ReleaseDeckMeasurementService, ReleaseDeckSchedulingService],
})
export class ReleaseDeckModule {}
