import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ArtistBandRegistrationDto } from './dto/registrar.dto';

@Injectable()
export class RegistrarService {
  constructor(private readonly prisma: PrismaService) {}

  async submitArtistBandRegistration(userId: string, dto: ArtistBandRegistrationDto) {
    const [scene, user] = await Promise.all([
      this.prisma.community.findUnique({
        where: { id: dto.sceneId },
        select: {
          id: true,
          city: true,
          state: true,
          musicCommunity: true,
          tier: true,
        },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          homeSceneCity: true,
          homeSceneState: true,
          homeSceneCommunity: true,
        },
      }),
    ]);

    if (!scene) {
      throw new NotFoundException('Scene not found');
    }
    if (scene.tier !== 'city') {
      throw new ForbiddenException('Registrar submissions are restricted to city-tier Home Scenes');
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const homeCity = (user.homeSceneCity ?? '').trim().toLowerCase();
    const homeState = (user.homeSceneState ?? '').trim().toLowerCase();
    const homeCommunity = (user.homeSceneCommunity ?? '').trim().toLowerCase();
    const sceneCity = (scene.city ?? '').trim().toLowerCase();
    const sceneState = (scene.state ?? '').trim().toLowerCase();
    const sceneCommunity = (scene.musicCommunity ?? '').trim().toLowerCase();

    if (!homeCity || !homeState || !homeCommunity) {
      throw new ForbiddenException('Registrar access requires an established Home Scene');
    }

    if (homeCity !== sceneCity || homeState !== sceneState || homeCommunity !== sceneCommunity) {
      throw new ForbiddenException('Registrar submissions are limited to your Home Scene');
    }

    const entry = await this.prisma.registrarEntry.create({
      data: {
        type: 'artist_band_registration',
        status: 'submitted',
        sceneId: scene.id,
        createdById: user.id,
        payload: {
          name: dto.name,
          slug: dto.slug,
          entityType: dto.entityType,
        },
      },
      select: {
        id: true,
        type: true,
        status: true,
        sceneId: true,
        createdById: true,
        payload: true,
        createdAt: true,
      },
    });

    return entry;
  }
}
