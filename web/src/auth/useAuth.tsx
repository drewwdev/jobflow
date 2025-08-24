import { useContext } from "react";
import { AuthContext } from "./context";
import type { AuthCtx } from "./context";

export function useAuth(): AuthCtx {
  return useContext(AuthContext);
}
