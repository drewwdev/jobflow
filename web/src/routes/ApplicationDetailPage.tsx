import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useState } from "react";

import type { Application, ApplicationUpdate } from "../types/application";

import ApplicationHeader from "../components/ApplicationHeader";
import ApplicationEditForm from "../components/ApplicationEditForm";
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";
import ActivityFilters from "../components/ActivityFilters";

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["application", id],
    queryFn: async () =>
      (await api.get<Application>(`/api/applications/${id}`)).data,
    enabled: !!id,
  });

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async (payload: ApplicationUpdate) =>
      (await api.put<Application>(`/api/applications/${id}`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["application", id] });
      qc.invalidateQueries({ queryKey: ["applications"] });
      setConfirmDiscard(false);
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => api.delete(`/api/applications/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      nav("/applications");
    },
  });

  const [filterType, setFilterType] = useState("All");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  if (!id) return <div style={{ padding: 16 }}>Missing id.</div>;
  if (isLoading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (error || !data) return <div style={{ padding: 16 }}>Not found.</div>;

  const a = data;

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      {!editing ? (
        <ApplicationHeader
          app={a}
          onEdit={() => {
            setConfirmDiscard(false);
            setEditing(true);
          }}
          onAskDelete={() => setConfirmDelete(true)}
          deleting={confirmDelete}
          onCancelDelete={() => setConfirmDelete(false)}
          onConfirmDelete={() => deleteMutation.mutate()}
          disableActions={deleteMutation.isPending}
        />
      ) : (
        <ApplicationEditForm
          initial={a}
          saving={updateMutation.isPending}
          onSubmit={(u) => updateMutation.mutate(u)}
          onCancel={() => setConfirmDiscard(true)}
          onAskDiscard={() => setConfirmDiscard(true)}
          confirmDiscard={confirmDiscard}
          onConfirmDiscard={() => {
            setEditing(false);
            setConfirmDiscard(false);
          }}
          onCancelDiscard={() => setConfirmDiscard(false)}
        />
      )}

      <hr style={{ margin: "16px 0" }} />
      <ActivityFilters
        type={filterType}
        from={filterFrom}
        to={filterTo}
        onType={setFilterType}
        onFrom={setFilterFrom}
        onTo={setFilterTo}
        onClear={() => {
          setFilterType("All");
          setFilterFrom("");
          setFilterTo("");
        }}
        show={showFilters}
        onToggle={() => setShowFilters((s) => !s)}
      />

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 10,
            padding: 12,
            background: "#fff",
          }}>
          <ActivityForm appId={a.id} />
        </div>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 10,
            padding: 12,
            background: "#fff",
          }}>
          <ActivityList
            appId={a.id}
            filters={
              { type: filterType, from: filterFrom, to: filterTo } as AFType
            }
          />
        </div>
      </div>
    </div>
  );
}
