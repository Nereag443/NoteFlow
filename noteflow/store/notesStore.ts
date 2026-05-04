import { create } from "zustand";
import { Note, Checklist, IdeaNote, ChecklistItem } from "@/types";

interface NoteStore {
    notes: Note[];
    checklists: Checklist[];
    ideas: IdeaNote[];
    addNote: (note: Note) => void;
    deleteNote: (id: string) => void;
    updateNote: (id: string, updatedFields: Partial<Note>) => void;

    addChecklist: (checklist: Checklist) => void;
    deleteChecklist: (id: string) => void;
    toggleChecklistItem: (checklistId: string, itemId: string) => void;

    addIdea: (idea: IdeaNote) => void;
    deleteIdea: (id: string) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
    notes: [],
    checklists: [],
    ideas: [],
    addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
    updateNote: (id, data) => set((state) => ({
        notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...data, updatedAt: new Date() } : note
        ),
    })),
    deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
    })),

    addChecklist: (checklist) => set((state) => ({ checklists: [...state.checklists, checklist] })),
    deleteChecklist: (id) => set((state) => ({
        checklists: state.checklists.filter((checklist) => checklist.id !== id),
    })),
    toggleChecklistItem: (checklistId, itemId) => set((state) => ({
        checklists: state.checklists.map((checklist) =>
            checklist.id !== checklistId ? checklist : {
                ...checklist,
                items: checklist.items.map((item) =>
                    item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
                ),
                updatedAt: new Date(),
        }),
    })),

    addIdea: (idea) => set((state) => ({ ideas: [...state.ideas, idea] })),
    deleteIdea: (id) => set((state) => ({
        ideas: state.ideas.filter((idea) => idea.id !== id),
    })),
}));
