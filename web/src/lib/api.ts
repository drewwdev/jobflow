import axios from "axios";
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "./authStorage";

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      (
        config.headers as Record<string, string>
      ).Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

let refreshing = false;
let pendingQueue: Array<() => void> = [];

async function refreshAccessToken(): Promise<void> {
  if (refreshing) {
    await new Promise<void>((resolve) => pendingQueue.push(resolve));
    return;
  }
  refreshing = true;
  try {
    const rt = getRefreshToken();
    if (!rt) throw new Error("No refresh token");

    const res = await api.post<TokenResponse>(
      "/api/auth/refresh",
      JSON.stringify(rt),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    setAccessToken(res.data.accessToken);
  } finally {
    refreshing = false;
    pendingQueue.forEach((fn) => fn());
    pendingQueue = [];
  }
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await refreshAccessToken();
        return api(original);
      } catch {
        clearTokens();
      }
    }
    return Promise.reject(error);
  }
);

export function toQuery(
  params: Record<string, string | number | undefined>
): string {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) u.set(k, String(v));
  });
  return u.toString();
}
