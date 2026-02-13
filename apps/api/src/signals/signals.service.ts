import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateSignalDto, FollowDto } from './dto/signal.dto';

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

  private async getOrCreateDefaultCollection(userId: string) {
    return this.prisma.collection.upsert({
      where: { userId_name: { userId, name: 'Personal' } },
      update: {},
      create: { userId, name: 'Personal' },
    });
  }

  async addToCollection(userId: string, signalId: string) {
    const collection = await this.getOrCreateDefaultCollection(userId);
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

    return { action, item, collectionId: collection.id };
  }

  async blastSignal(userId: string, signalId: string) {
    return this.prisma.signalAction.upsert({
      where: { userId_signalId_type: { userId, signalId, type: 'BLAST' } },
      update: {},
      create: { userId, signalId, type: 'BLAST' },
    });
  }

  async supportSignal(userId: string, signalId: string) {
    return this.prisma.signalAction.upsert({
      where: { userId_signalId_type: { userId, signalId, type: 'SUPPORT' } },
      update: {},
      create: { userId, signalId, type: 'SUPPORT' },
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
