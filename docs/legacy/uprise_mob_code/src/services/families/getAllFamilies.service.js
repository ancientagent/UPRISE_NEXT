import Config from 'react-native-config';
import { request } from '../../services/request/request.service';
import { GET } from '../../services/constants/Constants';
import { getRequestURL } from '../../utilities/utilities';
// DEPRECATED (Alpha): Families/Alliances are not used in the Alpha sub‑genre system.
// Prefer direct sub‑genre flows via genreAlpha.service.
import { listFamilies } from '../../contracts/families';

// Returns all families from API, falling back to local spec if API is absent.
export default async function getAllFamiliesRequest(payload = {}) {
  const endpoint = Config.FAMILIES_ALL || '/families/all';
  const requestOptions = {
    method: GET,
    url: getRequestURL(endpoint),
    headers: payload.accessToken ? { Authorization: `Bearer ${payload.accessToken}` } : {},
  };
  try {
    const res = await request(requestOptions);
    const arr = Array.isArray(res) ? res : (res?.families || []);
    if (arr.length) return arr;
    return listFamilies();
  } catch (_) {
    return listFamilies();
  }
}
