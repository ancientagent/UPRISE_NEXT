import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import {
  FairPlayGraduationRequestDto,
  FairPlayGraduationRequestSchema,
} from './dto/fair-play-graduation.dto';
import { FairPlayGraduationService } from './fair-play-graduation.service';

@Controller('admin/fair-play')
@UseGuards(JwtAuthGuard)
export class FairPlayGraduationController {
  constructor(private readonly fairPlayGraduationService: FairPlayGraduationService) {}

  @Post('graduation/run')
  @HttpCode(HttpStatus.OK)
  @ZodBody(FairPlayGraduationRequestSchema)
  async runGraduation(@Body() dto: FairPlayGraduationRequestDto) {
    return this.fairPlayGraduationService.runGraduation(dto);
  }
}
