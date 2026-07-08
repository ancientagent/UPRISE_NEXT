import { Module } from '@nestjs/common';
import { ReleaseDeckController } from './release-deck.controller';
import { ReleaseDeckMeasurementService } from './release-deck-measurement.service';

@Module({
  controllers: [ReleaseDeckController],
  providers: [ReleaseDeckMeasurementService],
  exports: [ReleaseDeckMeasurementService],
})
export class ReleaseDeckModule {}
