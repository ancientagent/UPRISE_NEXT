
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginSchema, RegisterSchema } from '@uprise/types';
import { ZodBody } from '../common/decorators/zod-body.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ZodBody(RegisterSchema)
  async register(@Body() dto: any) {
    const tokens = await this.authService.register(dto);
    return { success: true, data: tokens };
  }

  @Post('login')
  @ZodBody(LoginSchema)
  async login(@Body() dto: any) {
    const tokens = await this.authService.login(dto);
    return { success: true, data: tokens };
  }
}
