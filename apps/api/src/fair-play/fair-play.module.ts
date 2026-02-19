import { Module } from '@nestjs/common';
import { FairPlayService } from './fair-play.service';
import { RecurrenceAggregationJob } from './jobs/recurrence-aggregation.job';

@Module({
  providers: [FairPlayService, RecurrenceAggregationJob],
  exports: [FairPlayService, RecurrenceAggregationJob],
})
export class FairPlayModule {}
