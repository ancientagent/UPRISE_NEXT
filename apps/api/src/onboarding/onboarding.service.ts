import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { HomeSceneSelectionDto, GpsVerifyDto } from './dto/onboarding.dto';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async setHomeScene(userId: string, dto: HomeSceneSelectionDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        homeSceneCity: dto.city,
        homeSceneState: dto.state,
        homeSceneCommunity: dto.musicCommunity,
        homeSceneTag: dto.tasteTag ?? null,
      },
      select: {
        id: true,
        homeSceneCity: true,
        homeSceneState: true,
        homeSceneCommunity: true,
        homeSceneTag: true,
        gpsVerified: true,
      },
    });
  }

  async verifyGps(userId: string, dto: GpsVerifyDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        gpsVerified: true,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
      select: {
        id: true,
        gpsVerified: true,
        latitude: true,
        longitude: true,
      },
    });
  }
}
