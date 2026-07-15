import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MusicCommunityPreferenceResolverService } from '../users/music-community-preference-resolver.service';
import type { SectMotionRegistrationDto } from './dto/registrar.dto';

const SECT_SLUG_MAX_LENGTH = 120;

function normalizePayload(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return {};
  return payload as Record<string, unknown>;
}

function normalizePayloadText(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export function slugifySectName(name: string): string {
  const trimmed = name.trim();
  const asciiSlug = trimmed
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SECT_SLUG_MAX_LENGTH)
    .replace(/-+$/g, '');

  if (asciiSlug) return asciiSlug;

  const digest = createHash('sha256').update(trimmed.normalize('NFC')).digest('hex').slice(0, 16);
  return `sect-${digest}`;
}

function mapSectRequest(entry: any) {
  const payload = normalizePayload(entry.payload);
  return {
    id: entry.id,
    type: entry.type,
    status: entry.status,
    sceneId: entry.sceneId,
    payload: {
      sectName: normalizePayloadText(payload, 'sectName'),
      sectSlug: normalizePayloadText(payload, 'sectSlug'),
    },
    sect: entry.requestedSect ?? null,
    scene: entry.scene ?? null,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

@Injectable()
export class SectRegistrarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly musicCommunityPreferenceResolver: MusicCommunityPreferenceResolverService,
  ) {}

  private async assertHomeSceneRequest(userId: string, sceneId: string) {
    const [scene, user] = await Promise.all([
      this.prisma.community.findUnique({
        where: { id: sceneId },
        select: { id: true, name: true, city: true, state: true, musicCommunity: true, tier: true },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, homeSceneCity: true, homeSceneState: true, homeSceneCommunity: true },
      }),
    ]);

    if (!scene) throw new NotFoundException('Scene not found');
    if (scene.tier !== 'city') {
      throw new ForbiddenException('Registrar submissions are restricted to city-tier Home Scenes');
    }
    if (!user) throw new NotFoundException('User not found');

    const homeMusicCommunity = await this.musicCommunityPreferenceResolver.resolveDefaultMusicCommunity(
      userId,
      user.homeSceneCommunity,
    );
    const homeCity = (user.homeSceneCity ?? '').trim().toLowerCase();
    const homeState = (user.homeSceneState ?? '').trim().toLowerCase();
    const homeCommunity = (homeMusicCommunity ?? '').trim().toLowerCase();
    const sceneCity = (scene.city ?? '').trim().toLowerCase();
    const sceneState = (scene.state ?? '').trim().toLowerCase();
    const sceneCommunity = (scene.musicCommunity ?? '').trim().toLowerCase();

    if (!homeCity || !homeState || !homeCommunity) {
      throw new ForbiddenException('Registrar access requires an established Home Scene');
    }
    if (homeCity !== sceneCity || homeState !== sceneState || homeCommunity !== sceneCommunity) {
      throw new ForbiddenException('Registrar submissions are limited to your Home Scene');
    }

    return scene;
  }

  async submitSectRequest(userId: string, dto: SectMotionRegistrationDto) {
    const scene = await this.assertHomeSceneRequest(userId, dto.sceneId);
    const sectName = dto.sectName.trim();
    const sectSlug = slugifySectName(sectName);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const entry = await tx.registrarEntry.create({
          data: {
            type: 'sect_motion',
            status: 'submitted',
            sceneId: scene.id,
            createdById: userId,
            payload: { sectName, sectSlug },
          },
          select: {
            id: true,
            type: true,
            status: true,
            sceneId: true,
            payload: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        const requestedSect = await tx.sect.create({
          data: {
            parentCommunityId: scene.id,
            requestRegistrarEntryId: entry.id,
            name: sectName,
            slug: sectSlug,
          },
          select: { id: true, parentCommunityId: true, name: true, slug: true },
        });
        return mapSectRequest({ ...entry, requestedSect, scene });
      });
    } catch (error: any) {
      const target = String(error?.meta?.target ?? '');
      if (
        error?.code === 'P2002' &&
        (target.includes('parentCommunityId') || target.includes('requestRegistrarEntryId'))
      ) {
        throw new ConflictException('A Sect with this name already exists in your Home Scene');
      }
      throw error;
    }
  }

  async listSectRequests(userId: string) {
    const entries = await this.prisma.registrarEntry.findMany({
      where: { createdById: userId, type: 'sect_motion' },
      select: {
        id: true,
        type: true,
        status: true,
        sceneId: true,
        payload: true,
        createdAt: true,
        updatedAt: true,
        requestedSect: { select: { id: true, parentCommunityId: true, name: true, slug: true } },
        scene: { select: { id: true, name: true, city: true, state: true, musicCommunity: true, tier: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const countsByStatus = entries.reduce((acc: Record<string, number>, entry: any) => {
      acc[entry.status] = (acc[entry.status] ?? 0) + 1;
      return acc;
    }, {});

    return { total: entries.length, countsByStatus, entries: entries.map(mapSectRequest) };
  }

  async getSectRequest(userId: string, entryId: string) {
    const entry = await this.prisma.registrarEntry.findUnique({
      where: { id: entryId },
      select: {
        id: true,
        type: true,
        status: true,
        sceneId: true,
        createdById: true,
        payload: true,
        createdAt: true,
        updatedAt: true,
        requestedSect: { select: { id: true, parentCommunityId: true, name: true, slug: true } },
        scene: { select: { id: true, name: true, city: true, state: true, musicCommunity: true, tier: true } },
      },
    });

    if (!entry) throw new NotFoundException('Registrar entry not found');
    if (entry.type !== 'sect_motion') {
      throw new ForbiddenException('Registrar entry is not a Sect request');
    }
    if (entry.createdById !== userId) {
      throw new ForbiddenException('Only the requesting listener can read this Sect request');
    }
    return mapSectRequest(entry);
  }
}
