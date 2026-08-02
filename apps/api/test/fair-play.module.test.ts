import { Test, TestingModule } from '@nestjs/testing';
import { FairPlayModule } from '../src/fair-play/fair-play.module';
import { FairPlayService } from '../src/fair-play/fair-play.service';
import { FairPlayGraduationService } from '../src/fair-play/fair-play-graduation.service';
import { RadiyoLifecyclePreviewCoordinator } from '../src/fair-play/radiyo-lifecycle-preview.coordinator';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('FairPlayModule', () => {
  it('compiles with the music-community preference resolver dependency', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, FairPlayModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    expect(module.get(FairPlayService)).toBeInstanceOf(FairPlayService);
    expect(module.get(FairPlayGraduationService)).toBeInstanceOf(FairPlayGraduationService);
    expect(module.get(RadiyoLifecyclePreviewCoordinator)).toBeInstanceOf(
      RadiyoLifecyclePreviewCoordinator,
    );

    await module.close();
  });
});
