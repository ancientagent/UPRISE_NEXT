import { Module } from '@nestjs/common';
import { FairPlayService } from './fair-play.service';
import { RecurrenceAggregationJob } from './jobs/recurrence-aggregation.job';
import { FairPlayController } from './fair-play.controller';
import { BroadcastController } from './broadcast.controller';

@Module({
  controllers: [FairPlayController, BroadcastController],
  providers: [FairPlayService, RecurrenceAggregationJob],
  exports: [FairPlayService, RecurrenceAggregationJob],
})
export class FairPlayModule {}
