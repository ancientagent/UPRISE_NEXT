
import { Module } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { DiscoveryController } from './discovery.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [CommunitiesService],
  controllers: [CommunitiesController, DiscoveryController],
})
export class CommunitiesModule {}
