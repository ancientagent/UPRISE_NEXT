import { Module } from '@nestjs/common';
import { FairPlayService } from './fair-play.service';
import { RecurrenceAggregationJob } from './jobs/recurrence-aggregation.job';
import { FairPlayController } from './fair-play.controller';

@Module({
  controllers: [FairPlayController],
  providers: [FairPlayService, RecurrenceAggregationJob],
  exports: [FairPlayService, RecurrenceAggregationJob],
})
export class FairPlayModule {}
