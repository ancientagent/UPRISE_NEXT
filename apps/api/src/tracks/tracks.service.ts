
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { engagementToScore, isValidEngagementScore } from './engagement.utils';
import type { TrackEngageDto, EngagementType } from './dto/track-engage.dto';

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
