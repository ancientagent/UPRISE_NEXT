import { Test, TestingModule } from '@nestjs/testing';
import { FairPlayModule } from '../src/fair-play/fair-play.module';
import { FairPlayService } from '../src/fair-play/fair-play.service';
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

    await module.close();
  });
});
