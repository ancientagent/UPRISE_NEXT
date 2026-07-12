import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import {
  FairPlayIngestionRequestDto,
  FairPlayIngestionRequestSchema,
} from './dto/fair-play-ingestion.dto';
import { FairPlayIngestionService } from './fair-play-ingestion.service';

@Controller('admin/fair-play')
@UseGuards(JwtAuthGuard)
export class FairPlayIngestionController {
  constructor(private readonly fairPlayIngestionService: FairPlayIngestionService) {}

  @Post('new-releases/ingest')
  @HttpCode(HttpStatus.OK)
  @ZodBody(FairPlayIngestionRequestSchema)
  async ingestDueSchedules(@Body() dto: FairPlayIngestionRequestDto) {
    return this.fairPlayIngestionService.ingestDueSchedules(dto);
  }
}
