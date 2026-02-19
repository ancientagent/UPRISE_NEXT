
import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { SetCollectionDisplayDto, SetCollectionDisplaySchema } from './dto/user-profile.dto';

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

  @Post('me/collection-display')
  @ZodBody(SetCollectionDisplaySchema)
  async setCollectionDisplay(
    @Body() dto: SetCollectionDisplayDto,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.usersService.setCollectionDisplay(req.user.userId, dto.enabled);
    return { success: true, data: result };
  }
}
