import { Injectable } from '@nestjs/common';
import { FairPlayService } from '../fair-play.service';

@Injectable()
export class RecurrenceAggregationJob {
  constructor(private readonly fairPlayService: FairPlayService) {}

  async runForScene(sceneId: string, asOf = new Date()) {
    return this.fairPlayService.aggregateRecurrenceScores(sceneId, asOf);
  }
}
