import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, toQuery } from "../lib/api";
import { Link } from "react-router-dom";
import type { Application, AppStatus } from "../types/application";
import { STATUS_LABEL } from "../types/application";

async function fetchApplications(params: {
  status?: AppStatus;
  q?: string;
  page?: number;
  pageSize?: number;
}) {
  const qs = toQuery({
    status: params.status,
    q: params.q,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
  });
  const { data } = await api.get<Application[]>(
    "/api/applications" + (qs ? `?${qs}` : "")
  );
  return data;
}

export default function ApplicationsPage() {
  const [status, setStatus] = useState<AppStatus | undefined>(undefined);
  const [q, setQ] = useState("");

  const queryKey = useMemo(() => ["applications", { status, q }], [status, q]);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: () => fetchApplications({ status, q }),
    keepPreviousData: true,
  });

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Applications</h1>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 12,
          alignItems: "center",
        }}>
        <select
          value={status ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            setStatus(v === "" ? undefined : (Number(v) as AppStatus));
          }}>
          <option value="">All statuses</option>
          <option value={0}>Saved</option>
          <option value={1}>Applied</option>
          <option value={2}>PhoneScreen</option>
          <option value={3}>Interview</option>
          <option value={4}>Offer</option>
          <option value={5}>Rejected</option>
        </select>

        <input
          placeholder="Search title, company, location…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 6, minWidth: 240 }}
        />

        <button onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div>Loading applications…</div>
      ) : error ? (
        <div>Error loading applications.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {(data ?? []).map((a) => (
            <li
              key={a.id}
              style={{
                padding: 12,
                border: "1px solid #eee",
                borderRadius: 8,
                marginBottom: 8,
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    <Link to={`/applications/${a.id}`}>{a.title}</Link>
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {a.companyName ? a.companyName : "—"} •{" "}
                    {a.location || "Remote/—"}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#444" }}>
                  <strong>{STATUS_LABEL[a.status]}</strong>
                </div>
              </div>
              {a.sourceUrl ? (
                <div style={{ marginTop: 6 }}>
                  <a href={a.sourceUrl} target="_blank" rel="noreferrer">
                    {a.sourceUrl}
                  </a>
                </div>
              ) : null}
              <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
                Created: {new Date(a.createdAt).toLocaleString()}
                {a.appliedAt
                  ? ` • Applied: ${new Date(a.appliedAt).toLocaleDateString()}`
                  : ""}
                {a.interviewAt
                  ? ` • Interview: ${new Date(
                      a.interviewAt
                    ).toLocaleDateString()}`
                  : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
