import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistBandsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const artistBand = await this.prisma.artistBand.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        homeScene: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            state: true,
            musicCommunity: true,
            tier: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!artistBand) {
      throw new NotFoundException('Artist/Band entity not found');
    }

    return {
      id: artistBand.id,
      name: artistBand.name,
      slug: artistBand.slug,
      entityType: artistBand.entityType,
      registrarEntryRef: artistBand.registrarEntryRef,
      createdAt: artistBand.createdAt,
      updatedAt: artistBand.updatedAt,
      createdBy: artistBand.createdBy,
      homeScene: artistBand.homeScene,
      members: artistBand.members.map((member: any) => ({
        userId: member.userId,
        role: member.role,
        createdAt: member.createdAt,
        user: member.user,
      })),
      memberCount: artistBand.members.length,
    };
  }

  async findByUserId(userId: string) {
    const artistBands = await this.prisma.artistBand.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        entityType: true,
        registrarEntryRef: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return artistBands;
  }
}
