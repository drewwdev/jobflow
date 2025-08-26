import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { TYPES } from "../types/application";
import type { CreatePayload } from "../types/application";

export default function ActivityForm({ appId }: { appId: string }) {
  const qc = useQueryClient();
  const [type, setType] = useState<string>("Note");
  const [body, setBody] = useState<string>("");
  const [occurredAt, setOccurredAt] = useState<string>("");

  const createMutation = useMutation({
    mutationFn: async (payload: CreatePayload) =>
      api.post(`/api/applications/${appId}/activities`, payload),
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["activities", appId] });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createMutation.mutate({
          type,
          body: body.trim(),
          occurredAt: occurredAt.trim() || null,
        });
      }}
      style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label>
          When (ISO, optional)
          <input
            placeholder="2025-08-24T12:00:00Z"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
          />
        </label>
      </div>

      <label>
        Notes
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="What happened?"
          required
        />
      </label>

      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Adding…" : "Add activity"}
      </button>
    </form>
  );
}
