const AT_KEY = "jobflow_access_token";
const RT_KEY = "jobflow_refresh_token";

export function getAccessToken(): string | null {
  return localStorage.getItem(AT_KEY);
}
export function setAccessToken(token: string | null): void {
  if (token) localStorage.setItem(AT_KEY, token);
  else localStorage.removeItem(AT_KEY);
}
export function getRefreshToken(): string | null {
  return localStorage.getItem(RT_KEY);
}
export function setRefreshToken(token: string | null): void {
  if (token) localStorage.setItem(RT_KEY, token);
  else localStorage.removeItem(RT_KEY);
}
export function clearTokens(): void {
  localStorage.removeItem(AT_KEY);
  localStorage.removeItem(RT_KEY);
}
