import Config from 'react-native-config';
import TrackPlayer from 'react-native-track-player';
import * as RootNavigation from '../../navigators/RootNavigation';
import API from './API';
import NetworkUtils from '../../utilities/networkUtils';
import { showNoNetworkAlert } from '../../state/sagas/AlertUtility';
import { reduxHelpers } from '../../state/store/reduxHelpers';
import { SIGN_OUT } from '../../state/types/ActionTypes';

function setHeaders(headers) {
  const header = {
    'Accept-Language': 'en-US',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
    'client-id': Config.CLIENT_ID,
    'client-secret': Config.CLIENT_SECRET,
    ...headers,
  };
  return header;
}

export function combineHeaders(options, omitAuth) {
  if (!omitAuth) {
    return setHeaders({ ...options });
  }
  return setHeaders(options);
}

export function errorResponse(error, status) {
  // Should check error object here and do req changes checking different error objects
  const errorObject = {
    status,
    error,
  };
  console.log(`errorResponse ${JSON.stringify(errorObject)}`);
  
  if (status === 401 || status === 403) {
    console.log('User is not authorized - signing out');
    reduxHelpers.dispatch({ type: SIGN_OUT });
    TrackPlayer.stop();
    RootNavigation.navigate({ name: 'Login' });
  } else if (status >= 500) {
    // Server errors - don't throw immediately, could be temporary
    console.warn(`Server error ${status}: ${error}`);
    throw new Error(`Server temporarily unavailable (${status})`);
  } else if (status === 429) {
    // Rate limiting
    console.warn('Rate limited - too many requests');
    throw new Error('Too many requests - please wait a moment');
  } else {
    throw errorObject;
  }
}

// eslint-disable-next-line consistent-return
export async function request(requestOptions, omitAuth) {
  const requestData = requestOptions;
  requestData.headers = combineHeaders(requestOptions.headers, omitAuth);
  const isNetworkConnected = await NetworkUtils.isNetworkAvailable();
  if (isNetworkConnected) {
    try {
      if (__DEV__) {
        try {
          const dbg = {
            method: requestData.method,
            url: requestData.url,
            params: requestData.params,
          };
          // Only print discovery/radio/community calls to reduce noise
          const u = String(requestData.url || '');
          if (u.includes('/discovery') || u.includes('/radio') || (requestData.params && requestData.params.community_key)) {
            // eslint-disable-next-line no-console
            console.log('API request (geo/genre):', dbg);
          }
        } catch (e) { /* noop */ }
      }
      const res = await API(requestData);
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('res', { status: res.status, url: requestData.url });
      }
      return res.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data.error) {
          errorResponse(error.response.data.error, error.response.status);
        } else {
          errorResponse(error.response.data.message, error.response.status);
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        errorResponse(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        errorResponse(error.error);
      }
    }
  } else {
    showNoNetworkAlert();
  }
}
