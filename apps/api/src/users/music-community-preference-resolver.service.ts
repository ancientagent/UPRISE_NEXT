import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MusicCommunityPreferenceResolverService {
  constructor(private prisma: PrismaService) {}

  private normalize(value?: string | null) {
    const normalized = value?.trim();
    return normalized || null;
  }

  async resolveDefaultMusicCommunity(
    userId: string,
    compatibilityHomeSceneCommunity?: string | null,
  ): Promise<string | null> {
    const preference = await this.prisma.userMusicCommunityPreference.findFirst({
      where: { userId, isDefault: true },
      select: { musicCommunity: true },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'asc' }, { musicCommunity: 'asc' }],
    });
    const defaultPreference = this.normalize(preference?.musicCommunity);
    if (defaultPreference) return defaultPreference;

    const suppliedFallback = this.normalize(compatibilityHomeSceneCommunity);
    if (suppliedFallback) return suppliedFallback;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { homeSceneCommunity: true },
    });
    return this.normalize(user?.homeSceneCommunity);
  }
}
