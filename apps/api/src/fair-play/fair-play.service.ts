import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RotationPool } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FairPlayService {
  constructor(private prisma: PrismaService) {}

  async ingestNewRelease(trackId: string, sceneId: string) {
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
      select: { id: true, artist: true },
    });
    if (!track) {
      throw new NotFoundException({ success: false, error: { message: 'Track not found' } });
    }

    const scene = await this.prisma.community.findUnique({
      where: { id: sceneId },
      select: { id: true },
    });
    if (!scene) {
      throw new NotFoundException({ success: false, error: { message: 'Scene not found' } });
    }

    const activeArtistEntry = await this.prisma.rotationEntry.findFirst({
      where: {
        sceneId,
        pool: RotationPool.NEW_RELEASES,
        track: { artist: track.artist },
      },
      select: { id: true, trackId: true },
    });
    if (activeArtistEntry && activeArtistEntry.trackId !== trackId) {
      throw new ConflictException({
        success: false,
        error: { message: 'Artist already has an active new release in this scene' },
      });
    }

    try {
      const entry = await this.prisma.rotationEntry.create({
        data: {
          trackId,
          sceneId,
          pool: RotationPool.NEW_RELEASES,
          enteredPoolAt: new Date(),
        },
      });
      return { success: true, data: entry };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException({
          success: false,
          error: { message: 'Track already ingested for this scene' },
        });
      }
      throw error;
    }
  }
}
