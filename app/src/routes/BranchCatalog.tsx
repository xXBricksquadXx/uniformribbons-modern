import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRibbons } from "../data/useRibbons";
import { useSelectionStore } from "../store/useSelectionStore";

export default function BranchCatalog() {
  const { branchId } = useParams();
  const { ribbons, error } = useRibbons();
  const [q, setQ] = useState("");
  const { selected, toggleRibbon, setDevice, clear } = useSelectionStore();

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ribbons
      .filter((r) => {
        const branchOk = !branchId ? true : (r.branches?.includes("shared") || r.branches?.includes(branchId));
        const qOk = !query ? true : (r.name.toLowerCase().includes(query) || r.id.toLowerCase().includes(query));
        return branchOk && qOk;
      })
      .sort((a, b) => a.precedence - b.precedence);
  }, [ribbons, branchId, q]);

  if (error) return <div style={{ padding: 16 }}>Error loading ribbons: {error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Catalog: {branchId}</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or id..."
          style={{ width: 360 }}
        />
        <button onClick={clear}>Clear selections</button>
        <Link to="/">Change branch</Link>
      </div>

      <div style={{ marginTop: 16 }}>
        {filtered.map((r) => {
          const isOn = !!selected[r.id];
          return (
            <div key={r.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0" }}>
              <img src={r.image.legacyPath} alt={r.name} title={r.name} style={{ width: 120, height: "auto" }} />
              <div style={{ flex: 1 }}>
                <div>
                  <Link to={`/branch/${branchId}/ribbon/${r.id}`}>{r.name}</Link>
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>{r.id}</div>
              </div>

              {r.device?.options?.length ? (
                <select
                  value={selected[r.id]?.deviceValue ?? ""}
                  disabled={!isOn}
                  onChange={(e) => setDevice(r.id, e.target.value)}
                >
                  {r.device.options.map((opt) => (
                    <option key={`${r.id}:${opt.value}:${opt.label}`} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : null}

              <button onClick={() => toggleRibbon(r.id)}>{isOn ? "On" : "Off"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
