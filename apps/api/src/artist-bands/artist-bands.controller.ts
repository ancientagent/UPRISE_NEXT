import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ArtistBandsService } from './artist-bands.service';

@Controller('artist-bands')
@UseGuards(JwtAuthGuard)
export class ArtistBandsController {
  constructor(private artistBandsService: ArtistBandsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const artistBand = await this.artistBandsService.findOne(id);
    return { success: true, data: artistBand };
  }

  @Get()
  async findByUser(
    @Query('userId') userId: string | undefined,
    @Request() req: { user: { userId: string } },
  ) {
    const artistBands = await this.artistBandsService.findByUserId(userId ?? req.user.userId);
    return { success: true, data: artistBands };
  }
}
