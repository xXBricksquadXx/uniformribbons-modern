import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toPng } from "html-to-image";
import { useRibbons } from "../data/useRibbons";
import { useSelectionStore } from "../store/useSelectionStore";

export default function LegacyBuilder() {
  const { ribbons } = useRibbons();
  const { selected } = useSelectionStore();
  const [perRow, setPerRow] = useState<3|4|5>(3);
  const rackRef = useRef<HTMLDivElement | null>(null);

  const picked = useMemo(() => {
    const ids = new Set(Object.keys(selected));
    return ribbons
      .filter(r => ids.has(r.id))
      .sort((a,b) => a.precedence - b.precedence);
  }, [ribbons, selected]);

  const rows = useMemo(() => {
    const out: typeof picked[] = [];
    for (let i = 0; i < picked.length; i += perRow) out.push(picked.slice(i, i + perRow));
    return out;
  }, [picked, perRow]);

  async function savePng() {
    if (!rackRef.current) return;
    const dataUrl = await toPng(rackRef.current, { cacheBust: true, pixelRatio: 2 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "rack.png";
    a.click();
  }

  function deviceLabelFor(id: string) {
    const deviceValue = selected[id]?.deviceValue ?? "";
    // map value -> label by looking it up on the ribbon (simple + consistent)
    const r = ribbons.find(x => x.id === id);
    const label = r?.device?.options?.find(o => o.value === deviceValue)?.label ?? "";
    return label && label !== "DEVICE" ? label : "";
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <h2>Rack Builder Ribbon Checker</h2>
        <div className="controls">
          <Link className="btn" to="/catalog">Catalog</Link>
          <label className="ribbon-sub">
            Per row{" "}
            <select value={perRow} onChange={(e) => setPerRow(Number(e.target.value) as 3|4|5)}>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </label>
          <button onClick={savePng} disabled={picked.length === 0}>Save PNG</button>
        </div>
      </div>

      <div className="ribbon-list" style={{ padding: 16 }}>
        <div style={{ textAlign: "center", fontWeight: 700, marginBottom: 10 }}>
          Your Rack Builder Ribbon(s)
        </div>

        <div
          ref={rackRef}
          style={{
            padding: 18,
            borderRadius: 14,
            background: "rgba(255,255,255,.55)",
            border: "1px solid rgba(0,0,0,.08)",
            boxShadow: "0 10px 30px rgba(0,0,0,.10)"
          }}
        >
          {/* rack rows centered like the legacy output */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            {rows.map((row, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                {row.map(r => (
                  <div key={r.id} style={{ position: "relative" }}>
                    <img src={r.image.legacyPath} alt={r.name} style={{ width: 140, height: "auto" }} />
                    {deviceLabelFor(r.id) ? (
                      <div
                        style={{
                          position: "absolute",
                          right: 6,
                          top: 6,
                          padding: "3px 8px",
                          borderRadius: 999,
                          fontSize: 11,
                          background: "rgba(255,255,255,.75)",
                          border: "1px solid rgba(0,0,0,.12)"
                        }}
                      >
                        {deviceLabelFor(r.id)}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 700 }}>Displayed Ribbons</div>
          <ol style={{ marginTop: 8 }}>
            {picked.map((r) => {
              const d = deviceLabelFor(r.id);
              return <li key={r.id}>{r.name}{d ? ` — ${d}` : ""}</li>;
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
