import { Note } from "@/types";
import { StateCreator } from "zustand";
import * as api from "@/lib/api"

export interface NotesSlice {
  notes: Note[];
  isLoadingNotes: boolean;
  errorNotes: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (data: { title: string; content?: string }) => Promise<void>;
  updateNote: (id: string, data: { title?: string; content?: string; archived?: boolean }) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  archiveNote: (id: string) => Promise<void>;
  unarchiveNote: (id: string) => Promise<void>;
}

export const createNotesSlice: StateCreator<NotesSlice> = (set) => ({
  notes: [],
  isLoadingNotes: false,
  errorNotes: null,
  fetchNotes: async () => {
    set({ isLoadingNotes: true, errorNotes: null });
    try {
      const notes = await api.getNotes();
      set({ 
        notes: notes.map((n: any) => ({
          ...n,
          content: n.content ?? [],
          createdAt: new Date(n.created_at),
          updatedAt: new Date(n.updated_at)
        }))
      });
    } catch(e) {
      set({ errorNotes: 'Error al cargar notas' });
    }finally {
      set({ isLoadingNotes: false });
    }
  },
  addNote: async (data) => {
    try {
      const note = await api.createNote(data);
      const normalized = {
        ...note,
        content: note.content ?? [],
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at)
      }
      set((state) => ({ notes: [...state.notes, normalized] }));
      return normalized;
    }catch {
      set({ errorNotes: 'Error al crear nota' })
    }
  },
  updateNote: async (id, data) => {
    try {
      const updated = await api.updateNote(id, data);
      const normalized = {
        ...updated,
        content: updated.content ?? [],
        createdAt: new Date(updated.created_at),
        updatedAt: new Date(updated.updated_at),
      }
      set((state) => ({
        notes: state.notes.map((n) => n.id === id ? normalized : n),
      }));
    }catch {
      set( { errorNotes: 'Error al actualizar nota' })
    }
  },
  deleteNote: async (id) => {
    try {
      await api.deleteNote(id);
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
    } catch {
      set({ errorNotes: 'Errros al eliminar nota' })
    }
  },
  archiveNote: async (id) => {
    try {
      const updated = await api.updateNote(id, { archived: true });
      const normalized = {
        ...updated,
        content: updated.content ?? [],
        createdAt: new Date(updated.created_at),
        updatedAt: new Date(updated.updated_at),
      };
      set((state) => ({
        notes: state.notes.map((n) => n.id === id ? normalized : n
        ),
      }));
    } catch {
      set({ errorNotes: 'Error al archivar nota' });
    }
  },
  unarchiveNote: async (id) => {
    try {
      const updated = await api.updateNote(id, { archived: false });
      const normalized = {
        ...updated,
        content: updated.content ?? [],
        createdAt: new Date(updated.created_at),
        updatedAt: new Date(updated.updated_at),
      };
      set((state) => ({
      notes: state.notes.map((n) => n.id === id ?  normalized : n
      ),
    }));
    } catch {
      set({ errorNotes: 'Error al desarchivar nota' });
    }
  },
});