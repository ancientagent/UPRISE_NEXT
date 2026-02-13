import Config from 'react-native-config';
import { request } from '../request/request.service';
import { GET } from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

// Fetch comprehensive 97-genre list for onboarding and discovery
export default function getAllGenresRequest(payload = {}) {
  const endpoint = Config.GET_ALL_GENRES_URL || '/onboarding/all-genres';
  const requestOptions = {
    method: GET,
    url: getRequestURL(endpoint),
    headers: payload.accessToken ? { Authorization: `Bearer ${payload.accessToken}` } : {},
  };
  return request(requestOptions).then(response => response);
}

