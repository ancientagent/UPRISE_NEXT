import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../src/common/pipes/zod-validation.pipe';

const ExampleBodySchema = z.object({
  sceneId: z.string().min(1),
});

describe('ZodValidationPipe', () => {
  it('does not apply method-level body schemas to route params', () => {
    const pipe = new ZodValidationPipe(ExampleBodySchema);

    const result = pipe.transform('track-1', {
      type: 'param',
      metatype: String,
      data: 'id',
    });

    expect(result).toBe('track-1');
  });

  it('validates request bodies against the provided schema', () => {
    const pipe = new ZodValidationPipe(ExampleBodySchema);

    expect(
      pipe.transform(
        { sceneId: 'scene-1' },
        {
          type: 'body',
          metatype: Object,
          data: undefined,
        }
      )
    ).toEqual({ sceneId: 'scene-1' });
  });

  it('rejects invalid request bodies', () => {
    const pipe = new ZodValidationPipe(ExampleBodySchema);

    expect(() =>
      pipe.transform(
        { sceneId: '' },
        {
          type: 'body',
          metatype: Object,
          data: undefined,
        }
      )
    ).toThrow(BadRequestException);
  });
});
