import { Module } from '@nestjs/common';
import { FairPlayService } from './fair-play.service';
import { RecurrenceAggregationJob } from './jobs/recurrence-aggregation.job';
import { FairPlayController } from './fair-play.controller';
import { BroadcastController } from './broadcast.controller';
import { FairPlayMetricsController } from './fair-play-metrics.controller';

@Module({
  controllers: [FairPlayController, BroadcastController, FairPlayMetricsController],
  providers: [FairPlayService, RecurrenceAggregationJob],
  exports: [FairPlayService, RecurrenceAggregationJob],
})
export class FairPlayModule {}
