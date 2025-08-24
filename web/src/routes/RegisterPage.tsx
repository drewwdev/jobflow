import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setAccessToken, setRefreshToken } from "../lib/authStorage";

export default function RegisterPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post<{
        accessToken: string;
        refreshToken: string;
      }>("/api/auth/register", { email, password });
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      nav("/applications");
    } catch {
      setErr("Failed to register (email already used?)");
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 360 }}>
      <h1>Create account</h1>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Email{" "}
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password{" "}
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {err && <div style={{ color: "red" }}>{err}</div>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
