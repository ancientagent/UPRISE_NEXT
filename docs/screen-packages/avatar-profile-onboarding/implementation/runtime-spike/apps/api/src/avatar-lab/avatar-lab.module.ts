import { Module } from '@nestjs/common';
import { AvatarLabController } from './avatar-lab.controller';
import { AvatarLabService } from './avatar-lab.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AvatarLabController],
  providers: [AvatarLabService],
})
export class AvatarLabModule {}
