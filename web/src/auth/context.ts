import { createContext } from "react";

export type AuthCtx = {
  isAuth: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): void;
};

export const AuthContext = createContext<AuthCtx>({} as AuthCtx);
