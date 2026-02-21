export function formatArtistBandEntityType(entityType: string): string {
  if (entityType === 'artist') return 'Artist';
  if (entityType === 'band') return 'Band';
  return entityType;
}
