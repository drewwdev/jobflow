import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function toQuery(params: Record<string, string | number | undefined>) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) u.set(k, String(v));
  });
  return u.toString();
}
