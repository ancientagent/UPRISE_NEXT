
import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import type { Login, Register, AuthTokens } from '@uprise/types';
import { PrismaService } from '../prisma/prisma.service';
import type { InvitePreviewDto, RegisterFromInviteDto } from './dto/invite-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(dto: Register): Promise<AuthTokens> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      username: dto.username,
      displayName: dto.displayName,
      password: hashedPassword,
    });

    return this.generateTokens(user.id, user.email, user.username);
  }

  async login(dto: Login): Promise<AuthTokens> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.username);
  }

  async registerFromInvite(dto: RegisterFromInviteDto): Promise<AuthTokens> {
    const invite = await this.prisma.registrarArtistMember.findUnique({
      where: { inviteToken: dto.inviteToken },
      select: {
        id: true,
        email: true,
        inviteStatus: true,
        inviteTokenExpiresAt: true,
        existingUserId: true,
        claimedUserId: true,
        registrarEntry: {
          select: {
            scene: {
              select: {
                city: true,
                state: true,
                musicCommunity: true,
              },
            },
          },
        },
      },
    });

    if (!invite) {
      throw new ForbiddenException('Invalid invite token');
    }
    if (invite.claimedUserId) {
      throw new ConflictException('Invite has already been claimed');
    }
    if (invite.existingUserId) {
      throw new ConflictException('Invite email already belongs to an existing platform user');
    }
    if (invite.inviteTokenExpiresAt && invite.inviteTokenExpiresAt < new Date()) {
      throw new ForbiddenException('Invite token has expired');
    }
    if (invite.email.toLowerCase() !== dto.email.toLowerCase()) {
      throw new ForbiddenException('Invite token email mismatch');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          username: dto.username,
          displayName: dto.displayName,
          password: hashedPassword,
          city: invite.registrarEntry.scene.city ?? undefined,
          homeSceneCity: invite.registrarEntry.scene.city ?? undefined,
          homeSceneState: invite.registrarEntry.scene.state ?? undefined,
          homeSceneCommunity: invite.registrarEntry.scene.musicCommunity ?? undefined,
          gpsVerified: false,
        },
      });

      await tx.registrarArtistMember.update({
        where: { id: invite.id },
        data: {
          claimedUserId: createdUser.id,
          inviteStatus: 'claimed',
        },
      });

      return createdUser;
    });

    return this.generateTokens(user.id, user.email, user.username);
  }

  async previewInvite(dto: InvitePreviewDto) {
    const invite = await this.prisma.registrarArtistMember.findUnique({
      where: { inviteToken: dto.inviteToken },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        instrument: true,
        inviteStatus: true,
        inviteTokenExpiresAt: true,
        existingUserId: true,
        claimedUserId: true,
        registrarEntry: {
          select: {
            scene: {
              select: {
                city: true,
                state: true,
                musicCommunity: true,
              },
            },
          },
        },
      },
    });

    if (!invite) {
      throw new ForbiddenException('Invalid invite token');
    }
    if (invite.claimedUserId) {
      throw new ConflictException('Invite has already been claimed');
    }
    if (invite.existingUserId) {
      throw new ConflictException('Invite email already belongs to an existing platform user');
    }
    if (invite.inviteTokenExpiresAt && invite.inviteTokenExpiresAt < new Date()) {
      throw new ForbiddenException('Invite token has expired');
    }

    return {
      member: {
        name: invite.name,
        email: invite.email,
        city: invite.city,
        instrument: invite.instrument,
      },
      scene: invite.registrarEntry.scene,
      inviteStatus: invite.inviteStatus,
      inviteTokenExpiresAt: invite.inviteTokenExpiresAt,
    };
  }

  private generateTokens(userId: string, email: string, username: string): AuthTokens {
    const payload = { sub: userId, email, username };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      refreshToken: accessToken, // For simplicity, using same token
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    };
  }
}
