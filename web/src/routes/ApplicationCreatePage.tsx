import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

type AppStatus = 0 | 1 | 2 | 3 | 4 | 5;

export default function ApplicationCreatePage() {
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [status, setStatus] = useState<AppStatus>(0);
  const [companyId, setCompanyId] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.post("/api/applications", {
        title,
        location: location || null,
        sourceUrl: sourceUrl || null,
        status,
        companyId: companyId || null,
      });
      nav("/applications");
    } catch (err) {
      console.error(err);
      setError("Failed to save application.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>New Application</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 400,
        }}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Location
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>

        <label>
          Source URL
          <input
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            type="url"
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(Number(e.target.value) as AppStatus)}>
            <option value={0}>Saved</option>
            <option value={1}>Applied</option>
            <option value={2}>PhoneScreen</option>
            <option value={3}>Interview</option>
            <option value={4}>Offer</option>
            <option value={5}>Rejected</option>
          </select>
        </label>

        <label>
          Company ID (optional)
          <input
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          />
        </label>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Create"}
        </button>
      </form>
    </div>
  );
}
