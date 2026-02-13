
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommunitiesModule } from './communities/communities.module';
import { TracksModule } from './tracks/tracks.module';
import { EventsModule } from './events/events.module';
import { HealthModule } from './health/health.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PlacesModule } from './places/places.module';
import { SignalsModule } from './signals/signals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    OnboardingModule,
    PlacesModule,
    CommunitiesModule,
    TracksModule,
    EventsModule,
    SignalsModule,
  ],
})
export class AppModule {}
