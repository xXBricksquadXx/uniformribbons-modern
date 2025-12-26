export type BranchId =
  | "army"
  | "navy"
  | "marine_corps"
  | "air_force"
  | "space_force"
  | "coast_guard";

export const BRANCHES: { id: BranchId; label: string }[] = [
  { id: "army", label: "Army" },
  { id: "navy", label: "Navy" },
  { id: "marine_corps", label: "Marine Corps" },
  { id: "air_force", label: "Air Force" },
  { id: "space_force", label: "Space Force" },
  { id: "coast_guard", label: "Coast Guard" }
];
