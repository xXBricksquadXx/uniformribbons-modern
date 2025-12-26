import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRibbons } from "../data/useRibbons";
import { useSelectionStore } from "../store/useSelectionStore";
import { parseDeviceLabel } from "../utils/device";

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
        <div className="ribbon-list">No ribbons selected.</div>
      ) : (
        <div className="builder-grid" style={{ gridTemplateColumns: `repeat(${perRow}, 130px)` }}>
          {picked.map((r) => {
            const deviceValue = selected[r.id]?.deviceValue ?? "";
            const deviceLabel = r.device?.options?.find((o) => o.value === deviceValue)?.label ?? "";
            const parsed = parseDeviceLabel(deviceLabel);

            const iconSrc =
              parsed?.kind === "oak" ? "/devices/oak.png" :
              parsed?.kind === "star" ? "/devices/star.png" :
              null;

            return (
              <div key={r.id} className="builder-tile">
                {parsed && iconSrc ? (
                  <div className="device-overlay" title={parsed.raw}>
                    <img
                      src={iconSrc}
                      alt={parsed.kind}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                    {typeof parsed.count === "number" ? <span className="device-count">{parsed.count}</span> : null}
                  </div>
                ) : null}

                <img
                  src={r.image.legacyPath}
                  alt={r.name}
                  title={r.name}
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
