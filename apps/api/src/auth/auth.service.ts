
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import type { Login, Register, AuthTokens } from '@uprise/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
