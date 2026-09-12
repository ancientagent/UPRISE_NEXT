import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import {
  SectArtistBandMembershipSchema,
  type SectArtistBandMembershipDto,
  SectMotionRegistrationSchema,
  type SectMotionRegistrationDto,
} from './dto/registrar.dto';
import { SectRegistrarService } from './sect-registrar.service';

@Controller('registrar')
@UseGuards(JwtAuthGuard)
export class SectRegistrarController {
  constructor(private readonly sectRegistrarService: SectRegistrarService) {}

  @Post('sect-motion')
  @ZodBody(SectMotionRegistrationSchema)
  async submitSectRequest(
    @Body() dto: SectMotionRegistrationDto,
    @Request() req: { user: { userId: string } },
  ) {
    const entry = await this.sectRegistrarService.submitSectRequest(req.user.userId, dto);
    return { success: true, data: entry };
  }

  @Post('sect/:sectId/membership')
  @ZodBody(SectArtistBandMembershipSchema)
  async registerArtistBandMembership(
    @Param('sectId') sectId: string,
    @Body() dto: SectArtistBandMembershipDto,
    @Request() req: { user: { userId: string } },
  ) {
    const membership = await this.sectRegistrarService.registerArtistBandMembership(
      req.user.userId,
      sectId,
      dto,
    );
    return { success: true, data: membership };
  }

  @Get('sect-motion/entries')
  async listMySectRequests(@Request() req: { user: { userId: string } }) {
    const result = await this.sectRegistrarService.listSectRequests(req.user.userId);
    return { success: true, data: result };
  }

  @Get('sect-motion/:entryId')
  async getMySectRequest(
    @Param('entryId') entryId: string,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.sectRegistrarService.getSectRequest(req.user.userId, entryId);
    return { success: true, data: result };
  }
}
