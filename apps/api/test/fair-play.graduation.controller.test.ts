import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { FairPlayGraduationRequestSchema } from '../src/fair-play/dto/fair-play-graduation.dto';
import { FairPlayGraduationController } from '../src/fair-play/fair-play-graduation.controller';

describe('FairPlayGraduationController', () => {
  it('delegates manual graduation requests to the graduation service', async () => {
    const service = {
      runGraduation: jest.fn().mockResolvedValue({ success: true, data: { graduatedCount: 1 } }),
    };
    const controller = new FairPlayGraduationController(service as any);
    const dto = { communityId: 'community-1', asOf: '2026-07-11', dryRun: false };

    await expect(controller.runGraduation(dto)).resolves.toEqual({
      success: true,
      data: { graduatedCount: 1 },
    });
    expect(service.runGraduation).toHaveBeenCalledWith(dto);
  });

  it('validates the request contract and defaults to dry-run mode', () => {
    expect(
      FairPlayGraduationRequestSchema.parse({ communityId: ' community-1 ', asOf: '2026-07-11' }),
    ).toEqual({ communityId: 'community-1', asOf: '2026-07-11', dryRun: true });
    expect(() =>
      FairPlayGraduationRequestSchema.parse({ communityId: '', asOf: '07/11/2026' }),
    ).toThrow();
  });

  it('uses the current authenticated MVP admin guard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, FairPlayGraduationController);
    expect(guards).toContain(JwtAuthGuard);
  });
});
