import { useQuery } from "@tanstack/react-query";
import { api, toQuery } from "../lib/api";

async function fetchCompanies(search?: string) {
  const qs = toQuery({ search, page: 1, pageSize: 20 });
  const { data } = await api.get<Company[]>(
    "/api/companies" + (qs ? `?${qs}` : "")
  );
  return data;
}

export default function CompaniesPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["companies"],
    queryFn: () => fetchCompanies(),
  });

  if (isLoading) return <div style={{ padding: 16 }}>Loading companies…</div>;
  if (error) return <div style={{ padding: 16 }}>Error loading companies.</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Companies</h1>
      <button onClick={() => refetch()}>Refresh</button>
      <ul>
        {(data ?? []).map((c) => (
          <li key={c.id} style={{ margin: "8px 0" }}>
            <strong>{c.name}</strong>{" "}
            {c.website ? (
              <a href={c.website} target="_blank" rel="noreferrer">
                {c.website}
              </a>
            ) : null}
            <div style={{ color: "#666", fontSize: 12 }}>
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
