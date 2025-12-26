import { useEffect, useMemo, useState } from "react";
import type { Ribbon } from "./types";

export function useRibbons(): { ribbons: Ribbon[]; error?: string } {
  const [ribbons, setRibbons] = useState<Ribbon[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/data/ribbons.raw.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json) => setRibbons(json))
      .catch((e) => setError(String(e)));
  }, []);

  return useMemo(() => ({ ribbons, error }), [ribbons, error]);
}
