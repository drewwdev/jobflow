import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export type Activity = {
  id: string;
  applicationId: string;
  userId?: string;
  type: string;
  body: string;
  occurredAt: string;
  createdAt: string;
};

export default function ActivityList({ appId }: { appId: string }) {
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
  });

  if (isLoading) return <div>Loading activities…</div>;
  if (error) return <div>Failed to load activities.</div>;
  if (!data || data.length === 0) return <div>No activity yet.</div>;

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gap: 8,
      }}>
      {data.map((a) => (
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
