export const COLLECTION_SHELVES = [
  'singles',
  'uprises',
  'posters',
  'fliers',
  'merch_buttons',
  'merch_patches',
  'merch_shirts',
] as const;

export type CollectionShelf = (typeof COLLECTION_SHELVES)[number];

export function mapSignalToShelf(type: string, metadata?: Record<string, unknown> | null): CollectionShelf {
  const normalizedType = String(type || '').trim().toLowerCase();
  const metadataKind = String((metadata?.kind as string) || '').trim().toLowerCase();
  const value = metadataKind || normalizedType;

  if (['single', 'song', 'track', 'track_release'].includes(value)) return 'singles';
  if (['uprise'].includes(value)) return 'uprises';
  if (['poster'].includes(value)) return 'posters';
  if (['flier', 'flyer'].includes(value)) return 'fliers';
  if (['merch_button', 'button'].includes(value)) return 'merch_buttons';
  if (['merch_patch', 'patch'].includes(value)) return 'merch_patches';
  if (['merch_shirt', 'shirt'].includes(value)) return 'merch_shirts';

  return 'singles';
}
