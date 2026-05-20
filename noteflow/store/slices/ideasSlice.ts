import { IdeaNote } from "@/types";
import { StateCreator } from "zustand";

export interface IdeasSlice {
  ideas: IdeaNote[];
  addIdea: (idea: IdeaNote) => void;
  setIdeas: (ideas: IdeaNote[]) => void;
  deleteIdea: (id: string) => void;
  archiveIdea: (id: string) => void;
  archivedIdeas: IdeaNote[];
}

export const createIdeasSlice: StateCreator<IdeasSlice> = (set) => ({
  ideas: [],
  archivedIdeas: [],
  addIdea: (idea) =>
    set((state) => ({ ideas: [...state.ideas, idea] })),
  setIdeas: (ideas) => set({ ideas }),
  deleteIdea: (id) =>
    set((state) => ({ ideas: state.ideas.filter((i) => i.id !== id) })),
  archiveIdea: (id) =>
    set((state) => ({
      ideas: state.ideas.map((i) =>
        i.id === id ? { ...i, archived: true, updatedAt: new Date() } : i
      )
    })),
});