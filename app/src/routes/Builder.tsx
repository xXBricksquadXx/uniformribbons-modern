import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRibbons } from "../data/useRibbons";
import { useSelectionStore } from "../store/useSelectionStore";
import DeviceOverlay from "../components/DeviceOverlay";

export default function Builder() {
  const { ribbons, error } = useRibbons();
  const { selected, clear } = useSelectionStore();
  const [perRow, setPerRow] = useState<3 | 4 | 5>(3);

  const picked = useMemo(() => {
    const ids = new Set(Object.keys(selected));
    return ribbons
      .filter((r) => ids.has(r.id))
      .sort((a, b) => a.precedence - b.precedence);
  }, [ribbons, selected]);

  if (error) return <div className="app-shell">Error loading ribbons: {error}</div>;
  if (!ribbons.length) return <div className="app-shell">Loading…</div>;

  return (
    <div className="app-shell">
      <div className="topbar">
        <h2>Rack Preview</h2>

        <div className="controls">
          <Link className="btn" to="/catalog">Back</Link>
          <button onClick={clear}>Clear</button>

          <label className="ribbon-sub">
            Per row{" "}
            <select value={perRow} onChange={(e) => setPerRow(Number(e.target.value) as 3 | 4 | 5)}>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </label>

          <div className="ribbon-sub">Selected: {picked.length}</div>
        </div>
      </div>

      {picked.length === 0 ? (
        <div className="ribbon-list" style={{ padding: 16 }}>No ribbons selected.</div>
      ) : (
        <div className="builder-grid" style={{ gridTemplateColumns: `repeat(${perRow}, 140px)` }}>
          {picked.map((r) => {
            const deviceValue = selected[r.id]?.deviceValue ?? "";
            const deviceLabel = r.device?.options?.find((o) => o.value === deviceValue)?.label ?? "";

            return (
              <div
                key={r.id}
                className="builder-tile"
                style={{ position: "relative", width: 140 }}
              >
                <DeviceOverlay label={deviceLabel} />

                <img
                  src={r.image.legacyPath}
                  alt={r.name}
                  title={r.name}
                  style={{ width: 140, height: "auto", display: "block" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/image/missing.svg";
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
