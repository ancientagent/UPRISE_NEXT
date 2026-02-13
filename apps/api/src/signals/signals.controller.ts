import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { SignalsService } from './signals.service';
import { CreateSignalSchema, CreateSignalDto, FollowSchema, FollowDto } from './dto/signal.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class SignalsController {
  constructor(private signalsService: SignalsService) {}

  @Post('signals')
  @ZodBody(CreateSignalSchema)
  async createSignal(@Body() dto: CreateSignalDto, @Request() req: any) {
    const signal = await this.signalsService.createSignal(req.user.userId, dto);
    return { success: true, data: signal };
  }

  @Post('signals/:id/add')
  async addSignal(@Param('id') id: string, @Request() req: any) {
    const result = await this.signalsService.addToCollection(req.user.userId, id);
    return { success: true, data: result };
  }

  @Post('signals/:id/blast')
  async blastSignal(@Param('id') id: string, @Request() req: any) {
    const action = await this.signalsService.blastSignal(req.user.userId, id);
    return { success: true, data: action };
  }

  @Post('signals/:id/support')
  async supportSignal(@Param('id') id: string, @Request() req: any) {
    const action = await this.signalsService.supportSignal(req.user.userId, id);
    return { success: true, data: action };
  }

  @Post('follow')
  @ZodBody(FollowSchema)
  async follow(@Body() dto: FollowDto, @Request() req: any) {
    const follow = await this.signalsService.followEntity(req.user.userId, dto);
    return { success: true, data: follow };
  }
}
