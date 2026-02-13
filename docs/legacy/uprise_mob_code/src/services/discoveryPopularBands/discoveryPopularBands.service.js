import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';
import { buildGeoGenreParams } from '../../contracts/community';

export default function discoveryPopularBandsRequest(payload) {
  const finalUrl = Config.DISCOVERY_POPULAR_BANDS.replace('{COUNT}', payload.count);
  const requestOptions = {
    method: GET,
    url: getRequestURL(finalUrl),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
    params: buildGeoGenreParams({ communityKey: payload.communityKey, city: payload.city, state: payload.state, genre: payload.genre, lat: payload.lat, lng: payload.lng, radius: payload.radius }),
  };
  return request(requestOptions)
    .then(response => response);
}
