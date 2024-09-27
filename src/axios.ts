import axios from 'axios';
import { getLocalStoredTokens, setLocalStoredTokens } from '@/api/authentication';

const baseUrl = import.meta.env.VITE_API_ENDPOINT as string;

const api = axios.create({
  baseURL: baseUrl,
});

// Request interceptor for API calls
api.interceptors.request.use(
  async config => {
    const userTokens = getLocalStoredTokens();

    if (userTokens) {
      config.headers['Authorization'] = `Bearer ${userTokens.accessToken}`;
    }

    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';

    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    // Check if the request has the `_retry` flag to avoid infinite loops
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const userTokens = getLocalStoredTokens();

      // If there's no refresh token, reject the request
      if ((!userTokens)) {
        return Promise.reject(error);
      }

      try {
        // Request a new token using the refresh token
        const { data }: { data: TokenDataType } = await axios.post(`${baseUrl}/auth/refresh`, { refreshToken: userTokens.refreshToken }, { headers: {} });

        setLocalStoredTokens(data);
        originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle the error, e.g. redirect to login, clear tokens etc.
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;