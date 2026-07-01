
import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import {
  MusicCommunityPreferenceDto,
  MusicCommunityPreferenceSchema,
  SetCollectionDisplayDto,
  SetCollectionDisplaySchema,
} from './dto/user-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    const result = await this.usersService.findMany(+page, +limit);
    return {
      success: true,
      data: result.users,
      meta: { page: result.page, limit: result.limit, total: result.total },
    };
  }

  @Get('me')
  async findMe(@Request() req: { user: { userId: string } }) {
    const user = await this.usersService.findById(req.user.userId);
    return { success: true, data: user };
  }

  @Post('me/collection-display')
  @ZodBody(SetCollectionDisplaySchema)
  async setCollectionDisplay(
    @Body() dto: SetCollectionDisplayDto,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.usersService.setCollectionDisplay(req.user.userId, dto.enabled);
    return { success: true, data: result };
  }

  @Get('me/music-community-preferences')
  async listMyMusicCommunityPreferences(@Request() req: { user: { userId: string } }) {
    const result = await this.usersService.listMusicCommunityPreferences(req.user.userId);
    return { success: true, data: result };
  }

  @Post('me/music-community-preferences')
  @ZodBody(MusicCommunityPreferenceSchema)
  async addMyMusicCommunityPreference(
    @Body() dto: MusicCommunityPreferenceDto,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.usersService.addMusicCommunityPreference(req.user.userId, dto.musicCommunity);
    return { success: true, data: result };
  }

  @Post('me/music-community-preferences/default')
  @ZodBody(MusicCommunityPreferenceSchema)
  async setDefaultMusicCommunityPreference(
    @Body() dto: MusicCommunityPreferenceDto,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.usersService.setDefaultMusicCommunityPreference(req.user.userId, dto.musicCommunity);
    return { success: true, data: result };
  }

  @Get('me/home-scene-selector')
  async getMyHomeSceneSelector(@Request() req: { user: { userId: string } }) {
    const result = await this.usersService.getHomeSceneSelector(req.user.userId);
    return { success: true, data: result };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return { success: true, data: user };
  }

  @Get(':id/profile')
  async getProfile(@Param('id') id: string, @Request() req: { user: { userId: string } }) {
    const profile = await this.usersService.getProfileWithCollection(req.user.userId, id);
    return { success: true, data: profile };
  }
}
