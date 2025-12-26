import { create } from "zustand";
import { persist } from "zustand/middleware";

type SelectedRibbon = { id: string; deviceValue?: string };

type SelectionState = {
  selected: Record<string, SelectedRibbon>;
  toggleRibbon: (id: string) => void;
  setDevice: (id: string, deviceValue: string) => void;
  clear: () => void;
};

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set, get) => ({
      selected: {},
      toggleRibbon: (id) => {
        const cur = get().selected;
        const next = { ...cur };
        if (next[id]) delete next[id];
        else next[id] = { id };
        set({ selected: next });
      },
      setDevice: (id, deviceValue) => {
        const cur = get().selected;
        if (!cur[id]) return;
        set({ selected: { ...cur, [id]: { ...cur[id], deviceValue } } });
      },
      clear: () => set({ selected: {} })
    }),
    { name: "uniformribbons.selection.v1" }
  )
);
