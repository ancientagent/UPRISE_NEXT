
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
