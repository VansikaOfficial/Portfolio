import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const ACCESS_TOKEN_KEY = 'pcms_access_token';
const REFRESH_TOKEN_KEY = 'pcms_refresh_token';

export const tokenStorage = {
  getAccessToken: () => (typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null),
  getRefreshToken: () => (typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry && tokenStorage.getRefreshToken()) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token: string) => {
            if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: tokenStorage.getRefreshToken(),
        });
        const { accessToken, refreshToken } = data.data;
        tokenStorage.setTokens(accessToken, refreshToken);

        refreshQueue.forEach((cb) => cb(accessToken));
        refreshQueue = [];

        if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        tokenStorage.clear();
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/** Resolves a stored image/file path (local "/uploads/.." or full Cloudinary URL) to a usable URL */
export const resolveUploadUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';
  return `${base}${path}`;
};
