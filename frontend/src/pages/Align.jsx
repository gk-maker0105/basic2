import { useState } from "react";
import api from "../api";

export default function Align() {
  const [cvText, setCv] = useState("");
  const [jdText, setJd] = useState("");
  const [out, setOut] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async (e) => {
    e.preventDefault();
    setErr(""); setOut(null); setLoading(true);
    try {
      const { data } = await api.post("/api/resume/align", { cvText, jdText });
      setOut(data);
    } catch (e) {
      setErr(e?.response?.data?.msg || "Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  const pct = out ? Math.round(out.score * 100) : 0;

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", display: "grid", gap: 12 }}>
      <h2>Resume ↔ JD Alignment</h2>

      <form onSubmit={analyze} style={{ display: "grid", gap: 12 }}>
        <textarea
          rows={8}
          placeholder="Paste CV text here…"
          value={cvText}
          onChange={(e) => setCv(e.target.value)}
        />
        <textarea
          rows={6}
          placeholder="Paste JD text here…"
          value={jdText}
          onChange={(e) => setJd(e.target.value)}
        />
        <button disabled={loading || cvText.length < 10 || jdText.length < 10}>
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </form>

      {err && <div style={{ color: "crimson" }}>{err}</div>}

      {out && (
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{pct}%</div>
          <div style={{ opacity: 0.7 }}>Alignment ({out.method})</div>

          <h3 style={{ marginTop: 12 }}>Missing / Underrepresented</h3>
          {out.missingSkills?.length ? (
            <ul>
              {out.missingSkills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <div>No major gaps 🎉</div>
          )}
        </div>
      )}
    </div>
  );
}
