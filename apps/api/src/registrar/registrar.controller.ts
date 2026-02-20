import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { RegistrarService } from './registrar.service';
import {
  ArtistBandRegistrationSchema,
  type ArtistBandRegistrationDto,
  DispatchArtistInviteSchema,
  type DispatchArtistInviteDto,
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

  @Post('artist/:entryId/materialize')
  async materializeArtistBandRegistration(
    @Param('entryId') entryId: string,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.registrarService.materializeArtistBandRegistration(req.user.userId, entryId);
    return { success: true, data: result };
  }

  @Post('artist/:entryId/dispatch-invites')
  @ZodBody(DispatchArtistInviteSchema)
  async dispatchArtistBandInvites(
    @Param('entryId') entryId: string,
    @Body() dto: DispatchArtistInviteDto,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.registrarService.dispatchArtistBandInvites(req.user.userId, entryId, dto);
    return { success: true, data: result };
  }

  @Get('artist/:entryId/invites')
  async getArtistBandInviteStatus(
    @Param('entryId') entryId: string,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.registrarService.getArtistBandInviteStatus(req.user.userId, entryId);
    return { success: true, data: result };
  }
}
