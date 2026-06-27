
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MusicCommunityPreferenceResolverService } from './music-community-preference-resolver.service';

@Module({
  providers: [UsersService, MusicCommunityPreferenceResolverService],
  controllers: [UsersController],
  exports: [UsersService, MusicCommunityPreferenceResolverService],
})
export class UsersModule {}
