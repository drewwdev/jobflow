import { STATUS_LABEL } from "../types/application";
import type { Application } from "../types/application";

export default function ApplicationHeader({
  app,
  onEdit,
  onAskDelete,
  deleting,
  onCancelDelete,
  onConfirmDelete,
  disableActions,
}: {
  app: Application;
  onEdit: () => void;
  onAskDelete: () => void;
  deleting: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  disableActions?: boolean;
}) {
  return (
    <>
      <h1 style={{ marginBottom: 4 }}>{app.title}</h1>
      <div style={{ color: "#666", marginBottom: 8 }}>
        {app.companyName ?? "—"} • {app.location ?? "—"}
      </div>

      <div>
        Status: <strong>{STATUS_LABEL[app.status]}</strong>
      </div>

      {app.sourceUrl && (
        <div style={{ marginTop: 6 }}>
          <a href={app.sourceUrl} target="_blank" rel="noreferrer">
            {app.sourceUrl}
          </a>
        </div>
      )}

      <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
        Created: {new Date(app.createdAt).toLocaleString()}
        {app.appliedAt
          ? ` • Applied: ${new Date(app.appliedAt).toLocaleDateString()}`
          : ""}
        {app.interviewAt
          ? ` • Interview: ${new Date(app.interviewAt).toLocaleDateString()}`
          : ""}
        {app.offerAt
          ? ` • Offer: ${new Date(app.offerAt).toLocaleDateString()}`
          : ""}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={onEdit} disabled={disableActions}>
          Edit
        </button>
        {!deleting ? (
          <button
            onClick={onAskDelete}
            disabled={disableActions}
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
              onClick={onConfirmDelete}
              disabled={disableActions}
              style={{
                color: "white",
                background: "#c00",
                border: "none",
                padding: "6px 10px",
                borderRadius: 6,
              }}>
              Yes, delete
            </button>
            <button onClick={onCancelDelete} disabled={disableActions}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
}
