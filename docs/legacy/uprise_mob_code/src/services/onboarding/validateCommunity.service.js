import Config from 'react-native-config';
import { request } from '../request/request.service';
import { POST, GET } from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

// Validate if a local community (city/state/superGenre) is active and suggest nearest hub if not.
// Tries POST with payload by default; falls back to GET with query params if needed.
export default function validateCommunityRequest({ city, state, superGenre, accessToken } = {}) {
  const endpoint = Config.ONBOARDING_VALIDATE_COMMUNITY || '/onboarding/validate-community';
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  const postOptions = {
    method: POST,
    url: getRequestURL(endpoint),
    headers,
    data: JSON.stringify({ city, state, superGenre }),
  };

  return request(postOptions)
    .catch(() => {
      // Fallback to GET with params
      const getOptions = {
        method: GET,
        url: getRequestURL(endpoint),
        headers,
        params: { city, state, super_genre: superGenre },
      };
      return request(getOptions);
    })
    .then(response => response);
}

