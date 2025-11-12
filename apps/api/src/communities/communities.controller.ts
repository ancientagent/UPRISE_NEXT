
import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommunitySchema } from '@uprise/types';
import { ZodBody } from '../common/decorators/zod-body.decorator';

@Controller('communities')
@UseGuards(JwtAuthGuard)
export class CommunitiesController {
  constructor(private communitiesService: CommunitiesService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    const result = await this.communitiesService.findMany(+page, +limit);
    return {
      success: true,
      data: result.communities,
      meta: { page: result.page, limit: result.limit, total: result.total },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const community = await this.communitiesService.findById(id);
    return { success: true, data: community };
  }

  @Post()
  @ZodBody(CreateCommunitySchema)
  async create(@Body() dto: any, @Request() req: any) {
    const community = await this.communitiesService.create({
      ...dto,
      createdById: req.user.userId,
    });
    return { success: true, data: community };
  }
}
