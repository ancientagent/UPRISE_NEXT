import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { RegistrarService } from './registrar.service';
import {
  ArtistBandRegistrationSchema,
  type ArtistBandRegistrationDto,
} from './dto/registrar.dto';

@Controller('registrar')
@UseGuards(JwtAuthGuard)
export class RegistrarController {
  constructor(private readonly registrarService: RegistrarService) {}

  @Post('artist')
  @ZodBody(ArtistBandRegistrationSchema)
  async submitArtistBandRegistration(
    @Body() dto: ArtistBandRegistrationDto,
    @Request() req: { user: { userId: string } },
  ) {
    const entry = await this.registrarService.submitArtistBandRegistration(req.user.userId, dto);
    return { success: true, data: entry };
  }
}
