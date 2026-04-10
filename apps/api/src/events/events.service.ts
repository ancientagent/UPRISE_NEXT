
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreatePrintShopEventDto } from './dto/create-print-shop-event.dto';

const PROMOTER_CAPABILITY = 'promoter_capability';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findMany(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      this.prisma.event.findMany({ skip, take: limit }),
      this.prisma.event.count(),
    ]);

    return { events, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.event.findUnique({ where: { id } });
  }

  async createFromPrintShop(userId: string, dto: CreatePrintShopEventDto) {
    const [community, activePromoterGrant, artistBandMembership] = await Promise.all([
      this.prisma.community.findUnique({
        where: { id: dto.communityId },
        select: { id: true },
      }),
      this.prisma.userCapabilityGrant.findFirst({
        where: {
          userId,
          capability: PROMOTER_CAPABILITY,
          status: 'active',
          revokedAt: null,
        },
        select: { id: true },
      }),
      this.prisma.artistBandMember.findFirst({
        where: { userId },
        select: { artistBandId: true },
      }),
    ]);

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    if (!activePromoterGrant && !artistBandMembership) {
      throw new ForbiddenException(
        'Print Shop event creation requires active promoter capability or a linked Artist/Band source',
      );
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new BadRequestException('Event start and end dates must be valid');
    }

    if (endDate.getTime() < startDate.getTime()) {
      throw new BadRequestException('Event end date must be after the start date');
    }

    const created = await this.prisma.event.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        coverImage: dto.coverImage?.trim() ? dto.coverImage.trim() : null,
        startDate,
        endDate,
        locationName: dto.locationName.trim(),
        address: dto.address.trim(),
        latitude: dto.latitude,
        longitude: dto.longitude,
        communityId: dto.communityId,
        createdById: userId,
        maxAttendees: dto.maxAttendees ?? null,
      },
    });

    return {
      id: created.id,
      title: created.title,
      description: created.description,
      coverImage: created.coverImage ?? null,
      startDate: created.startDate.toISOString(),
      endDate: created.endDate.toISOString(),
      locationName: created.locationName,
      address: created.address,
      latitude: created.latitude,
      longitude: created.longitude,
      communityId: created.communityId,
      createdById: created.createdById,
      attendeeCount: created.attendeeCount,
      maxAttendees: created.maxAttendees ?? null,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }
}
