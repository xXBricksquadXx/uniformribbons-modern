export type DeviceKind = "oak" | "star" | "unknown";

export function parseDeviceLabel(label: string): { kind: DeviceKind; count?: number; raw: string } | null {
  const raw = (label ?? "").trim();
  if (!raw) return null;

  const up = raw.toUpperCase();
  if (up === "DEVICE") return null;

  const m = up.match(/^(\d+)\s+(.+)$/);
  const count = m ? Number(m[1]) : undefined;
  const rest = m ? m[2] : up;

  let kind: DeviceKind = "unknown";
  if (rest.includes("OAK")) kind = "oak";
  else if (rest.includes("STAR")) kind = "star";

  return { kind, count, raw };
}
