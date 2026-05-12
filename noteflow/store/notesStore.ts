import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNotesSlice, NotesSlice } from "./slices/notesSlice";
import { createChecklistSlice, ChecklistSlice } from "./slices/checklistSlice";
import { createIdeasSlice, IdeasSlice } from "./slices/ideasSlice";

interface HydrationSlice {
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

type NoteStore = NotesSlice & ChecklistSlice & IdeasSlice & HydrationSlice;

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get, api) => ({
      ...createNotesSlice(set, get, api),
      ...createChecklistSlice(set, get, api),
      ...createIdeasSlice(set, get, api),
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "noteflow-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);