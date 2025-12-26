import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRibbons } from "../data/useRibbons";
import { useSelectionStore } from "../store/useSelectionStore";

export default function Catalog() {
  const { ribbons, error } = useRibbons();
  const [q, setQ] = useState("");
  const { selected, toggleRibbon, setDevice, clear } = useSelectionStore();
  const selectedCount = Object.keys(selected).length;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ribbons
      .filter((r) => {
        if (!query) return true;
        return r.name.toLowerCase().includes(query) || r.id.toLowerCase().includes(query);
      })
      .sort((a, b) => a.precedence - b.precedence);
  }, [ribbons, q]);

  if (error) return <div className="app-shell">Error loading ribbons: {error}</div>;

  return (
    <div className="app-shell">
      <div className="topbar">
        <h2>Catalog</h2>

        <div className="controls">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search awards..."
          />
          <button onClick={clear}>Clear</button>
          <Link className="btn" to="/builder">Builder ({selectedCount})</Link>
          <Link className="btn" to="/about">About</Link>
        </div>
      </div>

      <div className="ribbon-list">
        {filtered.map((r) => {
          const isOn = !!selected[r.id];

          return (
            <div key={r.id} className="ribbon-item">
              <img
                className="ribbon-img"
                src={r.image.legacyPath}
                alt={r.name}
                title={r.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/image/missing.svg";
                }}
              />

              <div className="ribbon-meta">
                <div className="ribbon-name">
                  <Link to={`/ribbon/${r.id}`}>{r.name}</Link>
                </div>
                {/* removed: the id/picture_name line */}
              </div>

              <div className="ribbon-actions">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

