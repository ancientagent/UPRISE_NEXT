import { Module } from '@nestjs/common';
import { FairPlayService } from './fair-play.service';
import { RecurrenceAggregationJob } from './jobs/recurrence-aggregation.job';
import { FairPlayController } from './fair-play.controller';
import { BroadcastController } from './broadcast.controller';
import { FairPlayMetricsController } from './fair-play-metrics.controller';
import { FairPlayIngestionController } from './fair-play-ingestion.controller';
import { FairPlayIngestionService } from './fair-play-ingestion.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [
    FairPlayController,
    BroadcastController,
    FairPlayMetricsController,
    FairPlayIngestionController,
  ],
  providers: [FairPlayService, FairPlayIngestionService, RecurrenceAggregationJob],
  exports: [FairPlayService, FairPlayIngestionService, RecurrenceAggregationJob],
})
export class FairPlayModule {}
