import { formatArtistBandEntityType } from '../src/lib/registrar/artistBandLabels';

describe('artist band labels', () => {
  it('formats supported entity types', () => {
    expect(formatArtistBandEntityType('artist')).toBe('Artist');
    expect(formatArtistBandEntityType('band')).toBe('Band');
  });

  it('passes unknown entity types through', () => {
    expect(formatArtistBandEntityType('collective')).toBe('collective');
  });
});
