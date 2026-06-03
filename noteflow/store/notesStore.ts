import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNotesSlice, NotesSlice } from "./slices/notesSlice";
import { createChecklistSlice, ChecklistSlice } from "./slices/checklistSlice";
import { createIdeasSlice, IdeasSlice } from "./slices/ideasSlice";
import { createThemeSlice, ThemeSlice } from "./slices/themeSlice";
import { ChallengeSlice, createChallengeSlice } from "./slices/challengeSlice";

type NoteStore = NotesSlice & ChecklistSlice & IdeasSlice & ThemeSlice & ChallengeSlice;

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get, api) => ({
      ...createNotesSlice(set, get, api),
      ...createChecklistSlice(set, get, api),
      ...createIdeasSlice(set, get, api),
      ...createThemeSlice(set, get, api),
      ...createChallengeSlice(set, get, api),
    }),
    {
      name: "noteflow-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
        avatarUrl: state.avatarUrl,
        challenges: state.challenges,
      }),
    }
  )
);