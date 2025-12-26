import React from "react";

type DeviceKind = "oak" | "star";
type Metal = "bronze" | "silver" | "gold";

function parseDeviceLabel(label: string): { kind: DeviceKind; metal: Metal; count: number; raw: string } | null {
  const raw = (label ?? "").trim();
  if (!raw || raw.toUpperCase() === "DEVICE") return null;

  const up = raw.toUpperCase();
  const n = up.match(/(\d+)/);
  const count = n ? Number(n[1]) : 1;

  const kind: DeviceKind | null =
    up.includes("OAK") ? "oak" :
    up.includes("STAR") ? "star" :
    null;

  if (!kind) return null;

  const metal: Metal =
    up.includes("SILVER") ? "silver" :
    up.includes("GOLD") ? "gold" :
    up.includes("BRONZE") ? "bronze" :
    (kind === "oak" ? "bronze" : "gold"); // defaults

  return { kind, metal, count, raw };
}

function metalFill(m: Metal) {
  switch (m) {
    case "bronze": return "#B87333";
    case "silver": return "#C0C0C0";
    case "gold": return "#D4AF37";
  }
}

function Star({ metal }: { metal: Metal }) {
  const fill = metalFill(metal);
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5l2.93 6.32 6.9.63-5.2 4.54 1.6 6.78L12 17.9 5.77 20.77l1.6-6.78-5.2-4.54 6.9-.63L12 2.5z"
        fill={fill}
        stroke="rgba(0,0,0,.35)"
        strokeWidth="1"
      />
    </svg>
  );
}

// Simple “cluster” look (you can replace later with a more accurate oak leaf SVG path)
function Oak({ metal }: { metal: Metal }) {
  const fill = metalFill(metal);
  return (
    <svg width="20" height="18" viewBox="0 0 48 40" aria-hidden="true">
      <g fill={fill} stroke="rgba(0,0,0,.35)" strokeWidth="1">
        <ellipse cx="18" cy="16" rx="10" ry="7" />
        <ellipse cx="30" cy="16" rx="10" ry="7" />
        <ellipse cx="24" cy="25" rx="11" ry="8" />
        <rect x="23" y="26" width="2" height="10" rx="1" fill={fill} stroke="rgba(0,0,0,.35)" />
      </g>
    </svg>
  );
}

export default function DeviceOverlay({ label }: { label: string }) {
  const parsed = parseDeviceLabel(label);
  if (!parsed) return null;

  const { kind, metal, count, raw } = parsed;

  // First-pass rendering rule:
  // - up to 4 icons shown
  // - if more than 4, show "×N"
  const shown = Math.min(count, 4);
  const overflow = count > 4 ? count : 0;

  const Icon = kind === "oak" ? Oak : Star;

  return (
    <div className="dev-layer" title={raw} aria-label={raw}>
      <div className="dev-icons">
        {Array.from({ length: shown }).map((_, i) => (
          <span className="dev-icon" key={i}>
            <Icon metal={metal} />
          </span>
        ))}
        {overflow ? <span className="dev-mult">×{count}</span> : null}
      </div>
    </div>
  );
}
