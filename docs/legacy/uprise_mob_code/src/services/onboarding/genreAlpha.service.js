import Config from 'react-native-config';
import { request } from '../request/request.service';
import ALPHA_GENRES from '../../config/alpha_genres';

const byQuery = (q) => {
  const query = (q || '').toString().trim().toLowerCase();
  if (!query) return ALPHA_GENRES;
  return ALPHA_GENRES.filter(g => {
    const name = (g.name || '').toLowerCase();
    const id = (g.id || '').toLowerCase();
    const aliases = (g.aliases || []).map(a => (a || '').toLowerCase());
    return name.includes(query) || id.includes(query) || aliases.some(a => a.includes(query));
  });
};

export async function getApprovedSubGenres() {
  try {
    if (Config.APPROVED_GENRES_ENDPOINT) {
      const data = await request({ method: 'GET', url: Config.APPROVED_GENRES_ENDPOINT });
      return Array.isArray(data) ? data : (data?.genres || []);
    }
  } catch (_) { /* fall through to local */ }
  return ALPHA_GENRES;
}

export async function getSubGenreSuggestions({ q }) {
  try {
    if (Config.GENRE_SUGGESTIONS_ENDPOINT) {
      const url = `${Config.GENRE_SUGGESTIONS_ENDPOINT}?q=${encodeURIComponent(q || '')}`;
      const data = await request({ method: 'GET', url });
      return Array.isArray(data) ? data : (data?.genres || []);
    }
  } catch (_) { /* fall back */ }
  return byQuery(q).slice(0, 20);
}

export async function requestSubGenre({ name }) {
  try {
    if (Config.REQUEST_GENRE_ENDPOINT) {
      const data = await request({ method: 'POST', url: Config.REQUEST_GENRE_ENDPOINT, data: { name } });
      return data || { ok: true };
    }
  } catch (_) { /* noop */ }
  // Local stub: log to console; in alpha, capture via logs until backend ready.
  // eslint-disable-next-line no-console
  console.log('requestSubGenre (local stub):', { name });
  return { ok: true, local: true };
}

export default {
  getApprovedSubGenres,
  getSubGenreSuggestions,
  requestSubGenre,
};

