import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Root() {
  const { isAuth, logout } = useAuth();

  const loc = useLocation();
  const active = (p: string) =>
    loc.pathname === p ? { fontWeight: "bold" } : {};
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <nav
        style={{
          display: "flex",
          gap: 12,
          padding: 12,
          borderBottom: "1px solid #eee",
        }}>
        <Link to="/" style={active("/")}>
          Home
        </Link>
        <Link to="/companies" style={active("/companies")}>
          Companies
        </Link>
        <Link to="/applications" style={active("/applications")}>
          Applications
        </Link>
        <Link to="/applications/new" style={active("/applications/new")}>
          New Application
        </Link>
        <div style={{ marginLeft: "auto" }}>
          {isAuth ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <Link to="/login" style={active("/login")}>
              Login
            </Link>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
