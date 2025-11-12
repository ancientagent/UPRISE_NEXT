
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
