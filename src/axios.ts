import axios from 'axios';
import { getUserCredentials } from '@/api/authentication';

const baseUrl = import.meta.env.VITE_API_ENDPOINT as string;

const api = axios.create({
  baseURL: baseUrl,
});

// Request interceptor for API calls
api.interceptors.request.use(
  async config => {
    const userCredentials = getUserCredentials();

    if (userCredentials) {
      config.headers['Authorization'] = `OAuth ${userCredentials.authorization}`;
      config.headers['Client-Id'] = `OAuth ${userCredentials.clientId}`;
    }

    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';

    return config;
  },
  error => {
    Promise.reject(error);
  }
);

export default api;