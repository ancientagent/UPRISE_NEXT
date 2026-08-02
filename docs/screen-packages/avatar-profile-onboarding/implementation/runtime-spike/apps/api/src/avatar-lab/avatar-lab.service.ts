import { BadGatewayException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import type { GenerateAvatarCandidatesDto, SaveAvatarSelectionDto } from './dto/avatar-lab.dto';

const IMAGE_EDIT_URL = 'https://api.openai.com/v1/images/edits';
const STARTER_TOP_ID = 'uprise-tee-black';
const STARTER_OUTERWEAR_ID = 'outerwear-open-denim-vest-black';
const DEFAULT_STYLE_REFERENCE_PATH = resolve(
  __dirname,
  '../../../../art/avatar-system/rounds/03-professional-specification/stylized-punk-character-sheet-r3/01-stylized-punk-character-sheet-r3.png',
);

function capturedImageToBlob(dataUrl: string): Blob {
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) {
    throw new BadGatewayException('The captured image could not be read');
  }

  return new Blob([Buffer.from(match[2], 'base64')], { type: match[1] });
}

function buildAvatarPrompt(dto: GenerateAvatarCandidatesDto): string {
  return [
    'The first image is the listener\'s live camera likeness. The second image is the approved UPRISE visual-style reference only.',
    'Create a new hand-inked UPRISE listener character from the first image. Do not redraw the photograph with a generic sketch filter.',
    'Preserve the person\'s specific jaw, nose, eyes, mouth, hairline, hairstyle, glasses, facial hair, and other recognizable facial geometry.',
    'Translate that individual geometry into the same character construction shown by the style reference: graphic head silhouette, bold imperfect contour, simplified interior features, flat ink planes, consistent neck and shoulder proportions, and a front-facing belly-up crop.',
    'The result should be a distinct illustrated person inside one coherent UPRISE zine-comic system, not a generic preset model and not a realistic painted portrait.',
    'Use an off-white photocopied-paper ground, dominant black ink, restrained fluorescent chartreuse or magenta accents, and subtle xerox or screenprint texture.',
    `The listener's current music community is ${dto.musicCommunity}; use it only as subtle visual texture, not as a costume or identity inference.`,
    'Preserve the natural expression visible in the camera capture. Do not replace or exaggerate it.',
    'Use the camera image only for the listener\'s identity, head, and hair. Ignore the clothing visible in the camera image.',
    'Place the illustrated identity on the standardized UPRISE starter bust with fixed neck, shoulder, chest, and belly-crop registration so predefined wardrobe assets can align later.',
    'Dress the starter bust in a plain black UPRISE tee beneath a standardized open black denim vest. Keep the vest unadorned and open so the tee chest remains visible.',
    'Do not generate custom clothing, source logos, band merch, patches, buttons, accessories, or any outfit inferred from the camera image. The production renderer will later replace the tee and outerwear through authored asset layers.',
    'Do not copy any person, hairstyle, garment, patch, logo, or pose from the style-reference sheet.',
    'Do not add source logos, band merch, props, text beyond UPRISE, jewelry, tattoos, political symbols, scenery, a specification sheet, labels, multiple figures, or a background scene.',
  ].join(' ');
}

@Injectable()
export class AvatarLabService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async generateCandidates(dto: GenerateAvatarCandidatesDto) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException('Avatar generation is not configured');
    }

    const formData = new FormData();
    formData.append('model', this.configService.get<string>('UPRISE_AVATAR_IMAGE_MODEL') ?? 'gpt-image-2');
    formData.append('image[]', capturedImageToBlob(dto.capturedPhoto), 'camera-capture.png');
    const styleReferencePath =
      this.configService.get<string>('UPRISE_AVATAR_STYLE_REFERENCE_PATH') ??
      DEFAULT_STYLE_REFERENCE_PATH;
    try {
      formData.append(
        'image[]',
        new Blob([readFileSync(styleReferencePath)], { type: 'image/png' }),
        'uprise-style-reference.png',
      );
    } catch {
      throw new ServiceUnavailableException('Avatar style reference is not configured');
    }
    formData.append('prompt', buildAvatarPrompt(dto));
    formData.append('n', '3');
    formData.append('size', '1024x1024');
    formData.append('quality', 'medium');
    formData.append('output_format', 'png');

    const response = await fetch(IMAGE_EDIT_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    if (!response.ok) {
      throw new BadGatewayException('Avatar generation could not be completed');
    }

    const payload = (await response.json()) as { data?: Array<{ b64_json?: string }> };
    const candidates = (payload.data ?? [])
      .map((item) => item.b64_json)
      .filter((value): value is string => Boolean(value))
      .map((value) => `data:image/png;base64,${value}`);

    if (candidates.length === 0) {
      throw new BadGatewayException('Avatar generation returned no usable candidates');
    }

    return { candidates };
  }

  async saveSelection(userId: string, dto: SaveAvatarSelectionDto) {
    return this.prisma.$transaction(async (tx) => {
      const avatarProfile = await tx.avatarProfile.upsert({
        where: { userId },
        update: {
          identityRender: dto.avatar,
          musicCommunity: dto.musicCommunity,
          starterTopId: STARTER_TOP_ID,
          configuration: {
            version: 'photo-guided-v2',
            identitySource: 'camera-likeness',
            starterTopId: STARTER_TOP_ID,
            wardrobe: { topId: STARTER_TOP_ID, outerwearId: STARTER_OUTERWEAR_ID },
            wearables: [],
          },
        },
        create: {
          userId,
          identityRender: dto.avatar,
          musicCommunity: dto.musicCommunity,
          starterTopId: STARTER_TOP_ID,
          configuration: {
            version: 'photo-guided-v2',
            identitySource: 'camera-likeness',
            starterTopId: STARTER_TOP_ID,
            wardrobe: { topId: STARTER_TOP_ID, outerwearId: STARTER_OUTERWEAR_ID },
            wearables: [],
          },
        },
      });

      const user = await tx.user.update({
        where: { id: userId },
        data: {
          avatar: dto.avatar,
          bio: dto.bio?.trim() || null,
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          bio: true,
          avatar: true,
        },
      });

      return {
        ...user,
        avatarProfile: {
          id: avatarProfile.id,
          musicCommunity: avatarProfile.musicCommunity,
          starterTopId: avatarProfile.starterTopId,
        },
      };
    });
  }
}
