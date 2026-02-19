
import { Module } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { DiscoveryController } from './discovery.controller';

@Module({
  providers: [CommunitiesService],
  controllers: [CommunitiesController, DiscoveryController],
})
export class CommunitiesModule {}
