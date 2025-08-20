import { useEffect, useState } from "react";
import { getHistory } from "../api";

export default function History() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async (p = page, l = limit) => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await getHistory({ page: p, limit: l });
      // backend returns: { items, total }
      setItems(data.items || []);
      setTotal(Number(data.total || 0));
    } catch (e) {
      setErr(e?.response?.data?.msg || e?.message || "Failed to fetch history");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div style={{ maxWidth: 960, margin: "24px auto", display: "grid", gap: 16 }}>
      <h2>Alignment History</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <label>
          Page:&nbsp;
          <input
            type="number"
            min={1}
            max={9999}
            value={page}
            onChange={(e) => setPage(Math.max(1, Number(e.target.value) || 1))}
            style={{ width: 80 }}
          />
        </label>

        <label>
          Per page:&nbsp;
          <select value={limit} onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>

        <div style={{ marginLeft: "auto" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!canPrev || loading}>
            ← Prev
          </button>
          <button onClick={() => setPage((p) => p + 1)} disabled={!canNext || loading} style={{ marginLeft: 8 }}>
            Next →
          </button>
        </div>
      </div>

      {loading && <div>Loading…</div>}
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      {!loading && !err && (
        <>
          <div style={{ opacity: 0.7 }}>
            Showing page <b>{page}</b> of <b>{totalPages}</b> ({total} total)
          </div>

          <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "160px 120px 160px 1fr", fontWeight: 700, padding: 12, background: "#fafafa" }}>
              <div>Date</div>
              <div>Score</div>
              <div>Method</div>
              <div>Missing (top 3)</div>
            </div>

            {items.length === 0 ? (
              <div style={{ padding: 16 }}>No history yet.</div>
            ) : (
              items.map((it) => {
                const pct = Math.round((it.score ?? 0) * 100);
                const top3 = (it.missingSkills || []).slice(0, 3);
                const more = Math.max(0, (it.missingSkills || []).length - top3.length);
                const date = it.createdAt ? new Date(it.createdAt).toLocaleString() : "—";

                return (
                  <div key={it.id} style={{ display: "grid", gridTemplateColumns: "160px 120px 160px 1fr", padding: "12px 12px", borderTop: "1px solid #eee" }}>
                    <div>{date}</div>
                    <div>{pct}%</div>
                    <div>{it.method || "overlap_v0"}</div>
                    <div>
                      {top3.length ? top3.join(", ") : "—"}
                      {more > 0 ? ` +${more} more` : ""}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
