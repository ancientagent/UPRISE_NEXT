import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { ArtistBandsService } from './artist-bands.service';

@Controller('artist-bands')
export class ArtistBandsController {
  constructor(private artistBandsService: ArtistBandsService) {}

  @Get(':id/profile')
  @UseGuards(OptionalJwtAuthGuard)
  async findProfile(@Param('id') id: string, @Request() req: { user?: { userId: string } | null }) {
    const artistBand = await this.artistBandsService.findProfile(id, req.user?.userId);
    return { success: true, data: artistBand };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const artistBand = await this.artistBandsService.findOne(id);
    return { success: true, data: artistBand };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findByUser(
    @Query('userId') userId: string | undefined,
    @Request() req: { user: { userId: string } },
  ) {
    const artistBands = await this.artistBandsService.findByUserId(userId ?? req.user.userId);
    return { success: true, data: artistBands };
  }
}
