import { Body, Controller, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { FairPlayService } from './fair-play.service';
import { TrackVoteSchema, type TrackVoteDto } from './dto/track-vote.dto';

@Controller('tracks')
@UseGuards(JwtAuthGuard)
export class FairPlayController {
  constructor(private readonly fairPlayService: FairPlayService) {}

  @Post(':id/vote')
  @HttpCode(HttpStatus.OK)
  @ZodBody(TrackVoteSchema)
  async vote(
    @Param('id') id: string,
    @Body() dto: TrackVoteDto,
    @Request() req: { user: { userId: string } },
  ) {
    return this.fairPlayService.castVote(req.user.userId, id, dto);
  }
}
