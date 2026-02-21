import { Module } from '@nestjs/common';
import { ArtistBandsController } from './artist-bands.controller';
import { ArtistBandsService } from './artist-bands.service';

@Module({
  controllers: [ArtistBandsController],
  providers: [ArtistBandsService],
  exports: [ArtistBandsService],
})
export class ArtistBandsModule {}
