
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; slug: string; description: string; createdById: string }) {
    return this.prisma.community.create({ data });
  }

  async findMany(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [communities, total] = await Promise.all([
      this.prisma.community.findMany({ skip, take: limit }),
      this.prisma.community.count(),
    ]);

    return { communities, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.community.findUnique({ where: { id } });
  }
}
