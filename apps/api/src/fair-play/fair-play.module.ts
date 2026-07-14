import { Module } from '@nestjs/common';
import { FairPlayService } from './fair-play.service';
import { RecurrenceAggregationJob } from './jobs/recurrence-aggregation.job';
import { FairPlayController } from './fair-play.controller';
import { BroadcastController } from './broadcast.controller';
import { FairPlayMetricsController } from './fair-play-metrics.controller';
import { FairPlayIngestionController } from './fair-play-ingestion.controller';
import { FairPlayIngestionService } from './fair-play-ingestion.service';
import { FairPlayGraduationController } from './fair-play-graduation.controller';
import { FairPlayGraduationService } from './fair-play-graduation.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [
    FairPlayController,
    BroadcastController,
    FairPlayMetricsController,
    FairPlayIngestionController,
    FairPlayGraduationController,
  ],
  providers: [
    FairPlayService,
    FairPlayIngestionService,
    FairPlayGraduationService,
    RecurrenceAggregationJob,
  ],
  exports: [
    FairPlayService,
    FairPlayIngestionService,
    FairPlayGraduationService,
    RecurrenceAggregationJob,
  ],
})
export class FairPlayModule {}
