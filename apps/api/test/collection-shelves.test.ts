import { mapSignalToShelf } from '../src/common/constants/collection-shelves';

describe('mapSignalToShelf', () => {
  it('maps known types to fixed shelves', () => {
    expect(mapSignalToShelf('single')).toBe('singles');
    expect(mapSignalToShelf('uprise')).toBe('uprises');
    expect(mapSignalToShelf('poster')).toBe('posters');
    expect(mapSignalToShelf('flyer')).toBe('fliers');
    expect(mapSignalToShelf('button')).toBe('merch_buttons');
    expect(mapSignalToShelf('patch')).toBe('merch_patches');
    expect(mapSignalToShelf('shirt')).toBe('merch_shirts');
  });

  it('prefers metadata kind when present', () => {
    expect(mapSignalToShelf('single', { kind: 'uprise' })).toBe('uprises');
  });

  it('falls back to singles for unknown types', () => {
    expect(mapSignalToShelf('unknown_type')).toBe('singles');
  });
});
