import { Note } from "@/types";
import { StateCreator } from "zustand";

export interface NotesSlice {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  archiveNote: (id: string) => void;
}

export const createNotesSlice: StateCreator<NotesSlice> = (set) => ({
  notes: [],
  addNote: (note) =>
    set((state) => ({ notes: [...state.notes, note] })),
  updateNote: (id, data) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, ...data, updatedAt: new Date() } : n
      ),
    })),
  deleteNote: (id) =>
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) 
    })),
  archiveNote: (id) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, archived: true, updatedAt: new Date() } : n
      ),
    }))
});