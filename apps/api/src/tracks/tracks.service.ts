
import { Injectable, BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { engagementToScore, isValidEngagementScore } from './engagement.utils';
import type { TrackEngageDto, EngagementType } from './dto/track-engage.dto';
import type { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async findMany(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [tracks, total] = await Promise.all([
      this.prisma.track.findMany({ skip, take: limit, where: { status: 'ready' } }),
      this.prisma.track.count({ where: { status: 'ready' } }),
    ]);

    return { tracks, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.track.findUnique({ where: { id } });
  }

  async createTrack(userId: string, dto: CreateTrackDto) {
    let managedArtistBand:
      | {
          id: string;
          name: string;
          homeSceneId: string | null;
        }
      | null = null;

    if (dto.artistBandId) {
      managedArtistBand = await this.prisma.artistBand.findFirst({
        where: {
          id: dto.artistBandId,
          OR: [{ createdById: userId }, { members: { some: { userId } } }],
        },
        select: {
          id: true,
          name: true,
          homeSceneId: true,
        },
      });

      if (!managedArtistBand) {
        throw new ForbiddenException('Track release requires a managed Artist/Band source');
      }

      if (dto.communityId && managedArtistBand.homeSceneId && dto.communityId !== managedArtistBand.homeSceneId) {
        throw new BadRequestException('Track community must match the managed source Home Scene');
      }
    }

    if (dto.communityId) {
      const community = await this.prisma.community.findUnique({
        where: { id: dto.communityId },
        select: { id: true },
      });
      if (!community) {
        throw new NotFoundException({ success: false, error: { message: 'Community not found' } });
      }
    }

    return this.prisma.track.create({
      data: {
        title: dto.title,
        artist: managedArtistBand?.name ?? dto.artist,
        artistBandId: managedArtistBand?.id ?? null,
        album: dto.album ?? null,
        duration: dto.duration,
        fileUrl: dto.fileUrl,
        coverArt: dto.coverArt ?? null,
        communityId: dto.communityId ?? null,
        status: dto.status ?? 'ready',
        uploadedById: userId,
      },
    });
  }

  /**
   * Record engagement event for a track (Canon: 3/2/1/0 model)
   * Prevents duplicate engagement per user/track/session (spam guard)
   */
  async recordEngagement(userId: string, trackId: string, dto: TrackEngageDto) {
    // Verify track exists
    const track = await this.prisma.track.findUnique({ where: { id: trackId } });
    if (!track) {
      throw new NotFoundException({ success: false, error: { message: 'Track not found' } });
    }

    // Calculate score per Canon
    const score = engagementToScore(dto.type as EngagementType);

    // Validate score (additive model - no negative)
    if (!isValidEngagementScore(score)) {
      throw new ConflictException({ success: false, error: { message: 'Invalid engagement score' } });
    }

    // Record engagement (unique constraint prevents spam per session)
    try {
      const engagement = await this.prisma.trackEngagement.create({
        data: {
          userId,
          trackId,
          type: dto.type,
          score,
          sessionId: dto.sessionId,
        },
      });

      return { success: true, data: engagement };
    } catch (error: any) {
      // Unique constraint violation = duplicate engagement
      if (error.code === 'P2002') {
        throw new ConflictException({
          success: false,
          error: { message: 'Engagement already recorded for this session' },
        });
      }
      throw error;
    }
  }
}
