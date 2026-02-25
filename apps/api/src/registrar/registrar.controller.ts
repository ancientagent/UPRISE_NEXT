import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { RegistrarService } from './registrar.service';
import {
  ArtistBandRegistrationSchema,
  type ArtistBandRegistrationDto,
  DispatchArtistInviteSchema,
  type DispatchArtistInviteDto,
  PromoterRegistrationSchema,
  type PromoterRegistrationDto,
} from './dto/registrar.dto';

@Controller('registrar')
@UseGuards(JwtAuthGuard)
export class RegistrarController {
  constructor(private readonly registrarService: RegistrarService) {}

  @Post('promoter')
  @ZodBody(PromoterRegistrationSchema)
  async submitPromoterRegistration(
    @Body() dto: PromoterRegistrationDto,
    @Request() req: { user: { userId: string } },
  ) {
    const entry = await this.registrarService.submitPromoterRegistration(req.user.userId, dto);
    return { success: true, data: entry };
  }

  @Get('promoter/entries')
  async listMyPromoterRegistrations(@Request() req: { user: { userId: string } }) {
    const result = await this.registrarService.listPromoterRegistrations(req.user.userId);
    return { success: true, data: result };
  }

  @Get('promoter/:entryId')
  async getMyPromoterRegistration(
    @Param('entryId') entryId: string,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.registrarService.getPromoterRegistration(req.user.userId, entryId);
    return { success: true, data: result };
  }

  @Get('project/entries')
  async listMyProjectRegistrations(@Request() req: { user: { userId: string } }) {
    const result = await this.registrarService.listProjectRegistrations(req.user.userId);
    return { success: true, data: result };
  }

  @Get('project/:entryId')
  async getMyProjectRegistration(
    @Param('entryId') entryId: string,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.registrarService.getProjectRegistration(req.user.userId, entryId);
    return { success: true, data: result };
  }

  @Get('sect-motion/entries')
  async listMySectMotionRegistrations(@Request() req: { user: { userId: string } }) {
    const result = await this.registrarService.listSectMotionRegistrations(req.user.userId);
    return { success: true, data: result };
  }

  @Get('sect-motion/:entryId')
  async getMySectMotionRegistration(
    @Param('entryId') entryId: string,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.registrarService.getSectMotionRegistration(req.user.userId, entryId);
    return { success: true, data: result };
  }

  @Post('artist')
  @ZodBody(ArtistBandRegistrationSchema)
  async submitArtistBandRegistration(
    @Body() dto: ArtistBandRegistrationDto,
    @Request() req: { user: { userId: string } },
  ) {
    const entry = await this.registrarService.submitArtistBandRegistration(req.user.userId, dto);
    return { success: true, data: entry };
  }

  @Get('artist/entries')
  async listMyArtistBandRegistrations(@Request() req: { user: { userId: string } }) {
    const result = await this.registrarService.listArtistBandRegistrations(req.user.userId);
    return { success: true, data: result };
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

  @Post('artist/:entryId/sync-members')
  async syncArtistBandMembers(
    @Param('entryId') entryId: string,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.registrarService.syncArtistBandMembers(req.user.userId, entryId);
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
