// Community contracts and helpers for Phase 2
// - community_key format: city-state-genre (lowercase, dash-separated)
// - normalization for geo/genre params

const slug = v => (v || '')
  .toString()
  .trim()
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9\-]/g, '');

export const toCommunityKey = ({ city, state, genre }) => {
  if (!city || !state || !genre) return null;
  return [slug(city), slug(state), slug(genre)].join('-');
};

// Family-based community key: city-state-familyId
export const toFamilyCommunityKey = ({ city, state, familyId }) => {
  if (!city || !state || !familyId) return null;
  return [slug(city), slug(state), slug(familyId)].join('-');
};

export const fromCommunityKey = key => {
  if (!key) return { city: '', state: '', genre: '' };
  const parts = key.split('-');
  if (parts.length < 3) return { city: '', state: '', genre: '' };
  const genre = parts.pop();
  const state = parts.pop();
  const city = parts.join('-');
  return { city, state, genre };
};

export const buildGeoGenreParams = ({ communityKey, city, state, genre, lat, lng, radius }) => {
  // Prefer community_key when present
  if (communityKey) return { community_key: communityKey };
  // Else structured geo
  if (city && state && genre) return { city, state, genre };
  // Else radius search
  if (lat && lng && radius) return { lat, lng, radius };
  return {};
};

// Backwards compatible alias for legacy "station" usages during migration
export const stationToCommunityKey = ({ city, state, genre }) => toCommunityKey({ city, state, genre });

export default {
  toCommunityKey,
  fromCommunityKey,
  buildGeoGenreParams,
  stationToCommunityKey,
  toFamilyCommunityKey,
};
