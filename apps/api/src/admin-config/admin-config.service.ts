import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateFairPlayConfigDto } from './dto/fair-play-config.dto';

@Injectable()
export class AdminConfigService {
  private readonly globalScope = 'global';

  constructor(private readonly prisma: PrismaService) {}

  async getFairPlayConfig() {
    const config = await this.prisma.fairPlayConfig.findUnique({
      where: { scope: this.globalScope },
    });

    return {
      success: true,
      data: config,
    };
  }

  async updateFairPlayConfig(dto: UpdateFairPlayConfigDto) {
    const config = await this.prisma.fairPlayConfig.upsert({
      where: { scope: this.globalScope },
      update: dto,
      create: {
        scope: this.globalScope,
        ...dto,
      },
    });

    return {
      success: true,
      data: config,
    };
  }
}
