import { IdeaNote } from "@/types";
import { StateCreator } from "zustand";
import * as api from "@/lib/api";
import { getCurrentLocation } from "@/lib/location";

export interface IdeasSlice {
  ideas: IdeaNote[];
  isLoadingIdeas: boolean;
  errorIdeas: string | null;
  fetchIdeas: () => Promise<void>;
  addIdea: (data: { title: string; color?: string; tags?: string[] }) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  archiveIdea: (id: string) => Promise<void>;
  unarchiveIdea: (id: string) =>Promise<void>;
}

export const createIdeasSlice: StateCreator<IdeasSlice> = (set) => ({
  ideas: [],
  archivedIdeas: [],
  isLoadingIdeas: false,
  errorIdeas: null,
  fetchIdeas: async () => {
    set({ isLoadingIdeas: true, errorIdeas: null });
    try {
        const ideas = await api.getIdeas();
        set({
            ideas: ideas.map((i: any) => ({
                ...i,
                tags: i.tags ?? [],
                createdAt: new Date(i.created_at),
                updatedAt: new Date(i.updated_at)
            }))
        });
    } catch {
        set({ errorIdeas: 'Error al cargar ideas' });
    } finally {
        set({ isLoadingIdeas: false });
    }
},
  addIdea: async (data) => {
    try {
      const location = await getCurrentLocation();
      const idea = await api.createIdea({
        ...data,
        latitude: location?.latitude,
        longitude: location?.longitude,
        location_name: location?.locationName,
      });
        set((state) => ({ 
          ideas: [{ 
            ...idea, 
            tags: (idea.tags ?? []).filter(Boolean),
            createdAt: new Date(idea.created_at),
            updatedAt: new Date(idea.updated_at),
          }, ...state.ideas] 
        }));
    } catch {
      set({ errorIdeas: 'Error al crear idea' });
    }
  },

  deleteIdea: async (id) => {
    try {
      await api.deleteIdea(id);
      set((state) => ({ ideas: state.ideas.filter((i) => i.id !== id) }));
    } catch {
      set({ errorIdeas: 'Error eliminando idea' })
    }
  },
  archiveIdea: async (id) => {
    try {
      const updated = await api.updateIdea(id, { archived: true });
      set((state) => ({
        ideas: state.ideas.map((i) =>
          i.id === id ? { ...i, archived: updated.archived } : i
        )
      }));
    } catch {
      set({ errorIdeas: 'Error al archivar idea' })
    }
  },
    unarchiveIdea: async (id) => {
      try {
        const updated = await api.updateIdea(id, { archived: false });
        set((state) => ({
          ideas: state.ideas.map((i) =>
            i.id === id ? { ...i, archived: updated.archived } : i
        ),
      }));
    } catch {
      set({ errorIdeas: 'Error al desarchivar idea' })
    }
  },
});