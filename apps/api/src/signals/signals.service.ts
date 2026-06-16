import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateSignalDto, FollowDto } from './dto/signal.dto';
import { mapSignalToShelf } from '../common/constants/collection-shelves';

@Injectable()
export class SignalsService {
  constructor(private prisma: PrismaService) {}

  async createSignal(userId: string, dto: CreateSignalDto) {
    return this.prisma.signal.create({
      data: {
        type: dto.type,
        metadata: dto.metadata ?? undefined,
        communityId: dto.communityId ?? null,
        createdById: userId,
      },
    });
  }

  private async getOrCreateDefaultCollection(userId: string, shelfName: string) {
    return this.prisma.collection.upsert({
      where: { userId_name: { userId, name: shelfName } },
      update: {},
      create: { userId, name: shelfName },
    });
  }

  async addToCollection(userId: string, signalId: string) {
    const signal = await this.prisma.signal.findUnique({
      where: { id: signalId },
      select: { id: true, type: true, metadata: true },
    });
    if (!signal) {
      throw new NotFoundException('Signal not found');
    }

    const shelf = mapSignalToShelf(signal.type, (signal.metadata as Record<string, unknown> | null) ?? null);
    const collection = await this.getOrCreateDefaultCollection(userId, shelf);
    const action = await this.prisma.signalAction.upsert({
      where: { userId_signalId_type: { userId, signalId, type: 'ADD' } },
      update: {},
      create: { userId, signalId, type: 'ADD' },
    });

    const item = await this.prisma.collectionItem.upsert({
      where: { collectionId_signalId: { collectionId: collection.id, signalId } },
      update: {},
      create: { collectionId: collection.id, signalId },
    });

    return { action, item, collectionId: collection.id, shelf };
  }

  async blastSignal(userId: string, signalId: string) {
    return this.prisma.signalAction.upsert({
      where: { userId_signalId_type: { userId, signalId, type: 'BLAST' } },
      update: {},
      create: { userId, signalId, type: 'BLAST' },
    });
  }

  async recommendSignal(userId: string, signalId: string) {
    const heldSignal = await this.prisma.collectionItem.findFirst({
      where: {
        signalId,
        collection: {
          userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!heldSignal) {
      throw new BadRequestException('Collect this song before recommending it.');
    }

    return this.prisma.signalAction.upsert({
      where: { userId_signalId_type: { userId, signalId, type: 'RECOMMEND' } },
      update: {},
      create: { userId, signalId, type: 'RECOMMEND' },
    });
  }

  async followEntity(userId: string, dto: FollowDto) {
    return this.prisma.follow.upsert({
      where: { followerId_entityType_entityId: { followerId: userId, entityType: dto.entityType, entityId: dto.entityId } },
      update: {},
      create: { followerId: userId, entityType: dto.entityType, entityId: dto.entityId },
    });
  }
}
