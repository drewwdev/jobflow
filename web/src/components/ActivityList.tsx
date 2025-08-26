import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Activity, ActivityFilters } from "../types/application";

export default function ActivityList({
  appId,
  filters,
}: {
  appId: string;
  filters?: ActivityFilters;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["activities", appId],
    queryFn: async () => {
      const res = await api.get<Activity[]>(
        `/api/applications/${appId}/activities`
      );
      return res.data.sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
      );
    },
    enabled: !!appId,
  });

  if (isLoading) return <div>Loading activities…</div>;
  if (error) return <div>Failed to load activities.</div>;
  if (!data || data.length === 0) return <div>No activity yet.</div>;

  const { type, from, to } = filters ?? {};
  const fromTs = from ? new Date(from).getTime() : undefined;
  const toTs = to ? new Date(to).getTime() : undefined;

  const filtered = data.filter((a) => {
    const tOk = !type || type === "All" || a.type === type;
    const ts = new Date(a.occurredAt).getTime();
    const fromOk = fromTs === undefined || ts >= fromTs;
    const toOk = toTs === undefined || ts <= toTs;
    return tOk && fromOk && toOk;
  });

  if (filtered.length === 0) return <div>No matching activity.</div>;

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gap: 8,
      }}>
      {filtered.map((a) => (
        <li
          key={a.id}
          style={{ border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              flexWrap: "wrap",
            }}>
            <strong>{a.type}</strong>
            <span style={{ fontSize: 12, color: "#666" }}>
              {new Date(a.occurredAt).toLocaleString()}
            </span>
          </div>
          {a.body && (
            <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{a.body}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
