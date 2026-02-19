import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RotationPool } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { TrackVoteDto } from './dto/track-vote.dto';

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

  async aggregateRecurrenceScores(sceneId: string, asOf = new Date()) {
    const scene = await this.prisma.community.findUnique({
      where: { id: sceneId },
      select: { id: true },
    });
    if (!scene) {
      throw new NotFoundException({ success: false, error: { message: 'Scene not found' } });
    }

    const windowStart = new Date(asOf.getTime() - 14 * 24 * 60 * 60 * 1000);
    const entries = await this.prisma.rotationEntry.findMany({
      where: {
        sceneId,
        pool: RotationPool.MAIN_ROTATION,
      },
      select: {
        id: true,
        trackId: true,
      },
    });

    if (entries.length === 0) {
      return {
        success: true,
        data: {
          sceneId,
          updatedCount: 0,
          windowStart,
          asOf,
        },
      };
    }

    const scores = await this.prisma.trackEngagement.findMany({
      where: {
        trackId: { in: entries.map((entry) => entry.trackId) },
        createdAt: {
          gte: windowStart,
          lte: asOf,
        },
      },
      select: {
        trackId: true,
        score: true,
      },
    });

    const scoreByTrackId = new Map<string, number>();
    for (const row of scores) {
      scoreByTrackId.set(row.trackId, (scoreByTrackId.get(row.trackId) ?? 0) + row.score);
    }

    const updates = entries.map((entry) =>
      this.prisma.rotationEntry.update({
        where: { id: entry.id },
        data: { recurrenceScore: scoreByTrackId.get(entry.trackId) ?? 0 },
      }),
    );

    await this.prisma.$transaction(updates);

    return {
      success: true,
      data: {
        sceneId,
        updatedCount: updates.length,
        windowStart,
        asOf,
      },
    };
  }

  async castVote(userId: string, trackId: string, dto: TrackVoteDto) {
    if (dto.nowPlayingTrackId !== trackId) {
      throw new BadRequestException({
        success: false,
        error: { message: 'Vote allowed only for the currently playing track' },
      });
    }

    const [user, track, scene, inRotation] = await Promise.all([
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
      this.prisma.track.findUnique({
        where: { id: trackId },
        select: { id: true },
      }),
      this.prisma.community.findUnique({
        where: { id: dto.sceneId },
        select: {
          id: true,
          tier: true,
          city: true,
          state: true,
          musicCommunity: true,
        },
      }),
      this.prisma.rotationEntry.findFirst({
        where: {
          trackId,
          sceneId: dto.sceneId,
          pool: { in: [RotationPool.NEW_RELEASES, RotationPool.MAIN_ROTATION] },
        },
        select: { id: true },
      }),
    ]);

    if (!user) {
      throw new NotFoundException({ success: false, error: { message: 'User not found' } });
    }
    if (!track) {
      throw new NotFoundException({ success: false, error: { message: 'Track not found' } });
    }
    if (!scene) {
      throw new NotFoundException({ success: false, error: { message: 'Scene not found' } });
    }
    if (!inRotation) {
      throw new BadRequestException({
        success: false,
        error: { message: 'Track is not currently in the scene broadcast' },
      });
    }

    if (!user.gpsVerified) {
      throw new ForbiddenException({
        success: false,
        error: { message: 'GPS verification required to vote' },
      });
    }

    const homeCity = (user.homeSceneCity ?? '').toLowerCase();
    const homeState = (user.homeSceneState ?? '').toLowerCase();
    const homeCommunity = (user.homeSceneCommunity ?? '').toLowerCase();
    const sceneCity = (scene.city ?? '').toLowerCase();
    const sceneState = (scene.state ?? '').toLowerCase();
    const sceneCommunity = (scene.musicCommunity ?? '').toLowerCase();

    if (!homeCity || !homeState || !homeCommunity || homeCity !== sceneCity || homeState !== sceneState || homeCommunity !== sceneCommunity) {
      throw new ForbiddenException({
        success: false,
        error: { message: 'Voting is limited to your GPS-verified Home Scene' },
      });
    }

    try {
      const vote = await this.prisma.trackVote.create({
        data: {
          userId,
          trackId,
          sceneId: scene.id,
          tier: scene.tier,
          playbackSessionId: dto.playbackSessionId,
        },
      });
      return { success: true, data: vote };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException({
          success: false,
          error: { message: 'Vote already recorded for this track in this scene tier' },
        });
      }
      throw error;
    }
  }

  async getRotation(sceneId: string) {
    const scene = await this.prisma.community.findUnique({
      where: { id: sceneId },
      select: { id: true },
    });
    if (!scene) {
      throw new NotFoundException({ success: false, error: { message: 'Scene not found' } });
    }

    const [newEntries, mainEntries] = await Promise.all([
      this.prisma.rotationEntry.findMany({
        where: { sceneId, pool: RotationPool.NEW_RELEASES },
        orderBy: { enteredPoolAt: 'asc' },
        include: { track: true },
      }),
      this.prisma.rotationEntry.findMany({
        where: { sceneId, pool: RotationPool.MAIN_ROTATION },
        orderBy: [{ recurrenceScore: 'desc' }, { enteredPoolAt: 'asc' }],
        include: { track: true },
      }),
    ]);

    return {
      success: true,
      data: {
        newReleases: newEntries.map((entry) => entry.track),
        mainRotation: mainEntries.map((entry) => entry.track),
      },
      meta: {
        sceneId,
        generatedAt: new Date().toISOString(),
        newReleasesCount: newEntries.length,
        mainRotationCount: mainEntries.length,
      },
    };
  }

  async getMetrics(sceneId: string, asOf = new Date()) {
    const scene = await this.prisma.community.findUnique({
      where: { id: sceneId },
      select: { id: true },
    });
    if (!scene) {
      throw new NotFoundException({ success: false, error: { message: 'Scene not found' } });
    }

    const windowStart = new Date(asOf.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [activeNewCount, mainRotationCount, recurrenceStats, votesInWindow] = await Promise.all([
      this.prisma.rotationEntry.count({
        where: { sceneId, pool: RotationPool.NEW_RELEASES },
      }),
      this.prisma.rotationEntry.count({
        where: { sceneId, pool: RotationPool.MAIN_ROTATION },
      }),
      this.prisma.rotationEntry.aggregate({
        where: { sceneId, pool: RotationPool.MAIN_ROTATION },
        _avg: { recurrenceScore: true },
        _min: { recurrenceScore: true },
        _max: { recurrenceScore: true },
      }),
      this.prisma.trackVote.count({
        where: {
          sceneId,
          createdAt: {
            gte: windowStart,
            lte: asOf,
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        sceneId,
        asOf: asOf.toISOString(),
        windowStart: windowStart.toISOString(),
        activeNewCount,
        mainRotationCount,
        recurrence: {
          avg: recurrenceStats._avg.recurrenceScore ?? 0,
          min: recurrenceStats._min.recurrenceScore ?? 0,
          max: recurrenceStats._max.recurrenceScore ?? 0,
        },
        votesInWindow,
      },
    };
  }
}
