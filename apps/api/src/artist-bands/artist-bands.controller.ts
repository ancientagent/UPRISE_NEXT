import { Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ArtistBandsService } from './artist-bands.service';

@Controller('artist-bands')
@UseGuards(JwtAuthGuard)
export class ArtistBandsController {
  constructor(private artistBandsService: ArtistBandsService) {}

  @Get(':id/profile')
  async findProfile(@Param('id') id: string) {
    const artistBand = await this.artistBandsService.findProfile(id);
    return { success: true, data: artistBand };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const artistBand = await this.artistBandsService.findOne(id);
    return { success: true, data: artistBand };
  }

  @Post(':id/add')
  async addArtistBand(@Param('id') id: string, @Request() req: { user: { userId: string } }) {
    const result = await this.artistBandsService.addArtistBand(req.user.userId, id);
    return { success: true, data: result };
  }

  @Post(':id/support')
  async supportArtistBand(@Param('id') id: string, @Request() req: { user: { userId: string } }) {
    const result = await this.artistBandsService.supportArtistBand(req.user.userId, id);
    return { success: true, data: result };
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
