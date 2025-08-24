import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../lib/authStorage";
import { AuthContext } from "./context";
import type { AuthCtx } from "./context";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuth] = useState<boolean>(!!getAccessToken());

  useEffect(() => {
    let mounted = true;
    async function tryRefresh() {
      const rt = getRefreshToken();
      if (!rt || getAccessToken()) return;
      try {
        const res = await api.post<{
          accessToken: string;
          refreshToken: string;
        }>("/api/auth/refresh", JSON.stringify(rt), {
          headers: { "Content-Type": "application/json" },
        });
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        if (mounted) setIsAuth(true);
      } catch {
        clearTokens();
        if (mounted) setIsAuth(false);
      }
    }
    void tryRefresh();
    return () => {
      mounted = false;
    };
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const { data } = await api.post<{
      accessToken: string;
      refreshToken: string;
    }>("/api/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setIsAuth(true);
  }

  function logout(): void {
    const rt = getRefreshToken();
    if (rt)
      void api.post("/api/auth/logout", JSON.stringify(rt), {
        headers: { "Content-Type": "application/json" },
      });
    clearTokens();
    setIsAuth(false);
  }

  const value: AuthCtx = { isAuth, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
