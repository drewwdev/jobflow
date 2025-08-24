import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useState } from "react";

type AppStatus = 0 | 1 | 2 | 3 | 4 | 5;

type Application = {
  id: string;
  title: string;
  sourceUrl?: string | null;
  location?: string | null;
  status: AppStatus;
  companyId?: string | null;
  companyName?: string | null;
  createdAt: string;
  updatedAt: string;
  appliedAt?: string | null;
  interviewAt?: string | null;
  offerAt?: string | null;
};

const STATUS_LABEL: Record<AppStatus, string> = {
  0: "Saved",
  1: "Applied",
  2: "PhoneScreen",
  3: "Interview",
  4: "Offer",
  5: "Rejected",
};

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["application", id],
    queryFn: async () => {
      const res = await api.get<Application>(`/api/applications/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    location: string;
    sourceUrl: string;
    status: AppStatus;
    companyId: string;
    appliedAt: string;
    interviewAt: string;
    offerAt: string;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  function startEdit(a: Application) {
    setConfirmDelete(false);
    setConfirmDiscard(false);
    setForm({
      title: a.title,
      location: a.location ?? "",
      sourceUrl: a.sourceUrl ?? "",
      status: a.status,
      companyId: a.companyId ?? "",
      appliedAt: a.appliedAt ?? "",
      interviewAt: a.interviewAt ?? "",
      offerAt: a.offerAt ?? "",
    });
    setEditing(true);
  }

  function setField<K extends keyof NonNullable<typeof form>>(
    k: K,
    v: NonNullable<typeof form>[K]
  ) {
    setForm((prev) => (prev ? { ...prev, [k]: v } : prev));
  }

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      location?: string | null;
      sourceUrl?: string | null;
      status: AppStatus;
      companyId?: string | null;
      appliedAt?: string | null;
      interviewAt?: string | null;
      offerAt?: string | null;
    }) => {
      const res = await api.put<Application>(
        `/api/applications/${id}`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["application", id] });
      qc.invalidateQueries({ queryKey: ["applications"] });
      setConfirmDiscard(false);
      setForm(null);
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => api.delete(`/api/applications/${id}`),
    onSuccess: () => {
      setConfirmDelete(false);
      qc.invalidateQueries({ queryKey: ["applications"] });
      nav("/applications");
    },
  });

  if (!id) return <div style={{ padding: 16 }}>Missing id.</div>;

  if (isLoading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (error || !data) return <div style={{ padding: 16 }}>Not found.</div>;

  const a = data;

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      {!editing ? (
        <>
          <h1 style={{ marginBottom: 4 }}>{a.title}</h1>
          <div style={{ color: "#666", marginBottom: 8 }}>
            {a.companyName ?? "—"} • {a.location ?? "—"}
          </div>

          <div>
            Status: <strong>{STATUS_LABEL[a.status]}</strong>
          </div>

          {a.sourceUrl && (
            <div style={{ marginTop: 6 }}>
              <a href={a.sourceUrl} target="_blank" rel="noreferrer">
                {a.sourceUrl}
              </a>
            </div>
          )}

          <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
            Created: {new Date(a.createdAt).toLocaleString()}
            {a.appliedAt
              ? ` • Applied: ${new Date(a.appliedAt).toLocaleDateString()}`
              : ""}
            {a.interviewAt
              ? ` • Interview: ${new Date(a.interviewAt).toLocaleDateString()}`
              : ""}
            {a.offerAt
              ? ` • Offer: ${new Date(a.offerAt).toLocaleDateString()}`
              : ""}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={() => startEdit(a)}>Edit</button>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={deleteMutation.isPending}
                style={{
                  color: "white",
                  background: "#c00",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: 6,
                }}>
                Delete
              </button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <span>Are you sure?</span>
                <button
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                  style={{
                    color: "white",
                    background: "#c00",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: 6,
                  }}>
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleteMutation.isPending}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        form && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateMutation.mutate({
                title: form.title.trim(),
                location: form.location.trim() || null,
                sourceUrl: form.sourceUrl.trim() || null,
                status: form.status,
                companyId: form.companyId.trim() || null,
                appliedAt: form.appliedAt.trim() || null,
                interviewAt: form.interviewAt.trim() || null,
                offerAt: form.offerAt.trim() || null,
              });
            }}
            style={{ display: "grid", gap: 10 }}>
            <label>
              Title
              <input
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                required
              />
            </label>

            <label>
              Location
              <input
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
              />
            </label>

            <label>
              Source URL
              <input
                value={form.sourceUrl}
                onChange={(e) => setField("sourceUrl", e.target.value)}
                type="url"
              />
            </label>

            <label>
              Status
              <select
                value={String(form.status)}
                onChange={(e) =>
                  setField("status", Number(e.target.value) as AppStatus)
                }>
                <option value={0}>Saved</option>
                <option value={1}>Applied</option>
                <option value={2}>PhoneScreen</option>
                <option value={3}>Interview</option>
                <option value={4}>Offer</option>
                <option value={5}>Rejected</option>
              </select>
            </label>

            <label>
              Company ID
              <input
                value={form.companyId}
                onChange={(e) => setField("companyId", e.target.value)}
              />
            </label>

            <label>
              Applied At (ISO)
              <input
                placeholder="2025-08-24T12:00:00Z"
                value={form.appliedAt}
                onChange={(e) => setField("appliedAt", e.target.value)}
              />
            </label>

            <label>
              Interview At (ISO)
              <input
                placeholder="2025-08-26T15:30:00Z"
                value={form.interviewAt}
                onChange={(e) => setField("interviewAt", e.target.value)}
              />
            </label>

            <label>
              Offer At (ISO)
              <input
                placeholder="2025-09-01T09:00:00Z"
                value={form.offerAt}
                onChange={(e) => setField("offerAt", e.target.value)}
              />
            </label>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 6,
                alignItems: "center",
                flexWrap: "wrap",
              }}>
              <button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving…" : "Save"}
              </button>

              {!confirmDiscard ? (
                <button type="button" onClick={() => setConfirmDiscard(true)}>
                  Cancel
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span>Discard changes?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setConfirmDiscard(false);
                      setForm(null);
                    }}
                    style={{
                      color: "white",
                      background: "#c00",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: 6,
                    }}>
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDiscard(false)}>
                    Keep editing
                  </button>
                </div>
              )}
            </div>
          </form>
        )
      )}
    </div>
  );
}
