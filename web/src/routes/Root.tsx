import { Link, Outlet, useLocation } from "react-router-dom";

export default function Root() {
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
      </nav>
      <Outlet />
    </div>
  );
}
