import axios from 'axios';
import Config from 'react-native-config';
import TokenService from '../../utilities/TokenService';
import { getRequestURL } from '../../utilities/utilities';
import CircuitBreaker from './CircuitBreaker';

// Circuit breaker for token refresh operations
const tokenRefreshBreaker = new CircuitBreaker({
  failureThreshold: 2, // Fail after 2 consecutive failures
  timeout: 30000, // 30 second timeout
  resetTimeout: 60000 // Wait 1 minute before retry
});

const shouldIntercept = error => {
  try {
    // Don't intercept if circuit breaker is open
    const breakerState = tokenRefreshBreaker.getState();
    if (breakerState.state === 'OPEN') {
      console.warn('Token refresh circuit breaker is OPEN - skipping intercept');
      return false;
    }
    
    return error.response && error.response.status === 401;
  } catch (e) {
    return false;
  }
};

const setTokenData = (tokenData = {}, axiosClient) => {
  // If necessary: save to storage
  //   tokenData's content includes data from handleTokenRefresh(): {
  //     idToken: data.auth_token,
  //     refreshToken: data.refresh_token,
  //     expiresAt: data.expires_in,
  // };
};

const handleTokenRefresh = async () => {
  const refreshToken = await TokenService.getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  // Use circuit breaker to prevent infinite retry loops
  return tokenRefreshBreaker.execute(async () => {
    const url = getRequestURL(Config.REFRESH_TOKEN_URL);
    const options = {
      headers: {
        'x-refresh-token': refreshToken,
        'Access-Control-Allow-Origin': '*',
        'client-id': Config.CLIENT_ID,
        'client-secret': Config.CLIENT_SECRET,
      },
      timeout: 15000, // 15 second timeout for refresh requests
    };
    const payloadData = { data: {} };
    
    const response = await axios.post(url, payloadData, options);
    
    if (!response.data || !response.data.accessToken) {
      throw new Error('Invalid token refresh response');
    }
    
    const tokenData = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
    
    return tokenData;
  }, () => {
    // Fallback: clear tokens and force re-authentication
    console.warn('Token refresh failed - clearing tokens');
    TokenService.setAccessToken(null);
    TokenService.setRefreshToken(null);
    throw new Error('Token refresh failed - please login again');
  });
};

const attachTokenToRequest = (request, token) => {
  request.headers.Authorization = `Bearer ${token}`;
};

export default (axiosClient, customOptions = {}) => {
  let isRefreshing = false;
  let failedQueue = [];

  const options = {
    attachTokenToRequest,
    handleTokenRefresh,
    setTokenData,
    shouldIntercept,
    ...customOptions,
  };
  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  const interceptor = error => {
    if (!options.shouldIntercept(error)) {
      return Promise.reject(error);
    }

    if (error.config._retry || error.config._queued) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest._queued = true;
        options.attachTokenToRequest(originalRequest, token);
        return axiosClient.request(originalRequest);
      }).catch(err => Promise.reject(error), // Ignore refresh token request's "err" and return actual "error" for the original request
      // eslint-disable-next-line function-paren-newline
      );
    }

    originalRequest._retry = true;
    isRefreshing = true;
    return new Promise((resolve, reject) => {
      options.handleTokenRefresh.call(options.handleTokenRefresh)
        .then(tokenData => {
          options.setTokenData(tokenData, axiosClient);
          options.attachTokenToRequest(originalRequest, tokenData.accessToken);
          processQueue(null, tokenData.accessToken);
          resolve(axiosClient.request(originalRequest));
        })
        .catch(err => {
          processQueue(err, null);
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  };

  axiosClient.interceptors.response.use(undefined, interceptor);
};
