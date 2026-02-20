import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ArtistBandRegistrationDto } from './dto/registrar.dto';
import { randomUUID } from 'crypto';

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
          gpsVerified: true,
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
    if (!user.gpsVerified) {
      throw new ForbiddenException('Registrar artist/band registration requires GPS-verified Home Scene account');
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

    const memberEmails = dto.members.map((member) => member.email.toLowerCase());
    const existingUsers = await this.prisma.user.findMany({
      where: { email: { in: memberEmails } },
      select: { id: true, email: true },
    });
    const existingUserByEmail = new Map(existingUsers.map((existing) => [existing.email.toLowerCase(), existing]));

    await this.prisma.registrarArtistMember.createMany({
      data: dto.members.map((member) => {
        const existingUser = existingUserByEmail.get(member.email.toLowerCase());
        return {
          registrarEntryId: entry.id,
          name: member.name,
          email: member.email.toLowerCase(),
          city: member.city,
          instrument: member.instrument,
          existingUserId: existingUser?.id ?? null,
          inviteStatus: existingUser ? 'existing_user' : 'pending_email',
        };
      }),
    });

    return {
      ...entry,
      memberCount: dto.members.length,
      existingMemberCount: existingUsers.length,
      pendingInviteCount: dto.members.length - existingUsers.length,
    };
  }

  async materializeArtistBandRegistration(userId: string, entryId: string) {
    const entry = await this.prisma.registrarEntry.findUnique({
      where: { id: entryId },
      select: {
        id: true,
        type: true,
        status: true,
        sceneId: true,
        createdById: true,
        artistBandId: true,
        payload: true,
      },
    });

    if (!entry) {
      throw new NotFoundException('Registrar entry not found');
    }
    if (entry.type !== 'artist_band_registration') {
      throw new ForbiddenException('Registrar entry is not an artist/band registration');
    }
    if (entry.createdById !== userId) {
      throw new ForbiddenException('Only the submitting user can materialize this registration');
    }

    if (entry.artistBandId) {
      const existing = await this.prisma.artistBand.findUnique({
        where: { id: entry.artistBandId },
        select: {
          id: true,
          name: true,
          slug: true,
          entityType: true,
          homeSceneId: true,
          createdById: true,
          registrarEntryRef: true,
          createdAt: true,
        },
      });
      if (!existing) {
        throw new NotFoundException('Linked Artist/Band entity not found');
      }
      return {
        registrarEntryId: entry.id,
        status: entry.status,
        artistBand: existing,
        materialized: false,
      };
    }

    const payload = (entry.payload ?? {}) as Record<string, unknown>;
    const name = typeof payload.name === 'string' ? payload.name.trim() : '';
    const slug = typeof payload.slug === 'string' ? payload.slug.trim() : '';
    const entityType = payload.entityType === 'band' ? 'band' : payload.entityType === 'artist' ? 'artist' : '';

    if (!name || !slug || !entityType) {
      throw new ForbiddenException('Registrar payload is missing required Artist/Band fields');
    }

    try {
      const created = await this.prisma.$transaction(async (tx) => {
        const artistBand = await tx.artistBand.create({
          data: {
            name,
            slug,
            entityType,
            homeSceneId: entry.sceneId,
            createdById: userId,
            registrarEntryRef: entry.id,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            entityType: true,
            homeSceneId: true,
            createdById: true,
            registrarEntryRef: true,
            createdAt: true,
          },
        });

        await tx.artistBandMember.create({
          data: {
            artistBandId: artistBand.id,
            userId,
            role: 'owner',
          },
        });

        await tx.registrarEntry.update({
          where: { id: entry.id },
          data: {
            status: 'materialized',
            artistBandId: artistBand.id,
          },
        });

        return artistBand;
      });

      return {
        registrarEntryId: entry.id,
        status: 'materialized',
        artistBand: created,
        materialized: true,
      };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Artist/Band slug is already in use');
      }
      throw error;
    }
  }

  async dispatchArtistBandInvites(
    userId: string,
    entryId: string,
    links: { mobileAppUrl: string; webAppUrl: string },
  ) {
    const entry = await this.prisma.registrarEntry.findUnique({
      where: { id: entryId },
      select: {
        id: true,
        type: true,
        createdById: true,
        scene: {
          select: {
            city: true,
            state: true,
            musicCommunity: true,
          },
        },
      },
    });

    if (!entry) {
      throw new NotFoundException('Registrar entry not found');
    }
    if (entry.type !== 'artist_band_registration') {
      throw new ForbiddenException('Registrar entry is not an artist/band registration');
    }
    if (entry.createdById !== userId) {
      throw new ForbiddenException('Only the submitting user can dispatch invites for this registration');
    }

    const members = await this.prisma.registrarArtistMember.findMany({
      where: {
        registrarEntryId: entry.id,
        inviteStatus: 'pending_email',
      },
      select: {
        id: true,
        email: true,
        name: true,
        city: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    if (members.length === 0) {
      return {
        registrarEntryId: entry.id,
        queuedCount: 0,
      };
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14); // 14 days
    let queuedCount = 0;

    for (const member of members) {
      const token = randomUUID();
      await this.prisma.$transaction(async (tx) => {
        await tx.registrarArtistMember.update({
          where: { id: member.id },
          data: {
            inviteToken: token,
            inviteTokenExpiresAt: expiresAt,
            inviteStatus: 'queued',
          },
        });

        await tx.registrarInviteDelivery.upsert({
          where: { registrarArtistMemberId: member.id },
          update: {
            email: member.email,
            status: 'queued',
            payload: {
              inviteToken: token,
              mobileAppUrl: links.mobileAppUrl,
              webAppUrl: links.webAppUrl,
              memberName: member.name,
              memberCity: member.city,
              sceneCity: entry.scene.city,
              sceneState: entry.scene.state,
              musicCommunity: entry.scene.musicCommunity,
            },
            dispatchedAt: null,
          },
          create: {
            registrarArtistMemberId: member.id,
            email: member.email,
            status: 'queued',
            payload: {
              inviteToken: token,
              mobileAppUrl: links.mobileAppUrl,
              webAppUrl: links.webAppUrl,
              memberName: member.name,
              memberCity: member.city,
              sceneCity: entry.scene.city,
              sceneState: entry.scene.state,
              musicCommunity: entry.scene.musicCommunity,
            },
          },
        });
      });

      queuedCount += 1;
    }

    return {
      registrarEntryId: entry.id,
      queuedCount,
    };
  }
}
