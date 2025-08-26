import { useState } from "react";
import type {
  Application,
  ApplicationUpdate,
  AppStatus,
} from "../types/application";

export default function ApplicationEditForm({
  initial,
  saving,
  onSubmit,
  onAskDiscard,
  confirmDiscard,
  onConfirmDiscard,
  onCancelDiscard,
}: {
  initial: Application;
  saving: boolean;
  onSubmit: (update: ApplicationUpdate) => void;
  onCancel: () => void;
  onAskDiscard: () => void;
  confirmDiscard: boolean;
  onConfirmDiscard: () => void;
  onCancelDiscard: () => void;
}) {
  const [form, setForm] = useState({
    title: initial.title,
    location: initial.location ?? "",
    sourceUrl: initial.sourceUrl ?? "",
    status: initial.status,
    companyId: initial.companyId ?? "",
    appliedAt: initial.appliedAt ?? "",
    interviewAt: initial.interviewAt ?? "",
    offerAt: initial.offerAt ?? "",
  });

  function setField<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
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
        Title{" "}
        <input
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          required
        />
      </label>
      <label>
        Location{" "}
        <input
          value={form.location}
          onChange={(e) => setField("location", e.target.value)}
        />
      </label>
      <label>
        Source URL{" "}
        <input
          type="url"
          value={form.sourceUrl}
          onChange={(e) => setField("sourceUrl", e.target.value)}
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
        Company ID{" "}
        <input
          value={form.companyId}
          onChange={(e) => setField("companyId", e.target.value)}
        />
      </label>
      <label>
        Applied At (ISO){" "}
        <input
          value={form.appliedAt}
          onChange={(e) => setField("appliedAt", e.target.value)}
        />
      </label>
      <label>
        Interview At (ISO){" "}
        <input
          value={form.interviewAt}
          onChange={(e) => setField("interviewAt", e.target.value)}
        />
      </label>
      <label>
        Offer At (ISO){" "}
        <input
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
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>

        {!confirmDiscard ? (
          <button type="button" onClick={onAskDiscard}>
            Cancel
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>Discard changes?</span>
            <button
              type="button"
              onClick={onConfirmDiscard}
              style={{
                color: "white",
                background: "#c00",
                border: "none",
                padding: "6px 10px",
                borderRadius: 6,
              }}>
              Discard
            </button>
            <button type="button" onClick={onCancelDiscard}>
              Keep editing
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
