import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuth } = useAuth();
  const loc = useLocation();
  if (!isAuth) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}
