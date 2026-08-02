import { Body, Controller, NotFoundException, Post, Request, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { AvatarLabService } from './avatar-lab.service';
import {
  GenerateAvatarCandidatesSchema,
  type GenerateAvatarCandidatesDto,
  SaveAvatarSelectionSchema,
  type SaveAvatarSelectionDto,
} from './dto/avatar-lab.dto';

@Controller('avatar-lab')
export class AvatarLabController {
  constructor(
    private readonly avatarLabService: AvatarLabService,
    private readonly configService: ConfigService,
  ) {}

  @Post('candidates')
  @UseGuards(JwtAuthGuard)
  @ZodBody(GenerateAvatarCandidatesSchema)
  async generateCandidates(
    @Body() dto: GenerateAvatarCandidatesDto,
    @Request() _req: { user: { userId: string } },
  ) {
    const result = await this.avatarLabService.generateCandidates(dto);
    return { success: true, data: result };
  }

  @Post('selection')
  @UseGuards(JwtAuthGuard)
  @ZodBody(SaveAvatarSelectionSchema)
  async saveSelection(
    @Body() dto: SaveAvatarSelectionDto,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.avatarLabService.saveSelection(req.user.userId, dto);
    return { success: true, data: result };
  }

  @Post('test-candidates')
  @ZodBody(GenerateAvatarCandidatesSchema)
  async generateTestCandidates(@Body() dto: GenerateAvatarCandidatesDto) {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new NotFoundException();
    }
    const result = await this.avatarLabService.generateCandidates(dto);
    return { success: true, data: result };
  }
}
