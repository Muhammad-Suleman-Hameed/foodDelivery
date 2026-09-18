import Axios, { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useEnvironmentStore } from '../store/useEnvironmentStore';

const getOptions = async (customHeaders: object = {}) => {
  const accessToken = useAuthStore.getState().accessToken;
  return {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...customHeaders,
    },
  };
};

const prepareUrl = (endpoint: string): string => {
  const baseUrl = useEnvironmentStore.getState().getBaseUrl().replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

const axios = {
  get: async <T = any>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> => {
    const options = await getOptions(config.headers);
    const response = await Axios.get<T>(prepareUrl(endpoint), { ...config, ...options });
    return response.data;
  },

  post: async <T = any>(endpoint: string, data: any = {}, headers: object = {}): Promise<T> => {
    const options = await getOptions(headers);
    const response = await Axios.post<T>(prepareUrl(endpoint), data, options);
    return response.data;
  },

  patch: async <T = any>(endpoint: string, data: any = {}, headers: object = {}): Promise<T> => {
    const options = await getOptions(headers);
    const response = await Axios.patch<T>(prepareUrl(endpoint), data, options);
    return response.data;
  },

  put: async <T = any>(endpoint: string, data: any = {}, headers: object = {}): Promise<T> => {
    const options = await getOptions(headers);
    const response = await Axios.put<T>(prepareUrl(endpoint), data, options);
    return response.data;
  },

  delete: async <T = any>(endpoint: string, headers: object = {}): Promise<T> => {
    const options = await getOptions(headers);
    const response = await Axios.delete<T>(prepareUrl(endpoint), options);
    return response.data;
  },
};

export default axios;
