import Config from 'react-native-config';
import { request } from '../request/request.service';
import { POST } from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

// Assigns user to a community for the chosen family and location.
// Fallback: if API missing, returns locally-constructed { community_key } when provided.
export default async function assignCommunityRequest({ city, state, familyId, accessToken, fallbackKey }) {
  const endpoint = Config.ASSIGN_COMMUNITY || '/users/assign-community';
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  try {
    const requestOptions = {
      method: POST,
      url: getRequestURL(endpoint),
      headers,
      data: JSON.stringify({ city, state, familyId }),
    };
    const res = await request(requestOptions);
    return res;
  } catch (e) {
    if (fallbackKey) return { community_key: fallbackKey, fallback: true };
    throw e;
  }
}

