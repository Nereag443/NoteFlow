import { Checklist, Priority, ChecklistItem } from "@/types";
import { StateCreator } from "zustand";

export interface ChecklistSlice {
  checklists: Checklist[];
  addChecklist: (checklist: Checklist) => void;
  deleteChecklist: (id: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
  addChecklistItem: (checklistId: string, item: ChecklistItem) => void;
  updateChecklistTitle: (checklistId: string, title: string) => void;
  updateChecklistItem: (checklistId: string, itemId: string, text: string) => void;
  deleteChecklistItem: (checklistId: string, itemId: string) => void;
  updateChecklistPriority: (checklistId: string, priority: Priority) => void;
  archiveChecklist: (id: string) => void;
}

export const createChecklistSlice: StateCreator<ChecklistSlice> = (set) => ({
  checklists: [],
  addChecklist: (checklist) => {
    set((state) => ({ checklists: [...state.checklists, checklist] }));
  },
  deleteChecklist: (id) =>
    set((state) => ({
      checklists: state.checklists.filter((c) => c.id !== id),
    })),
  toggleChecklistItem: (checklistId, itemId) =>
    set((state) => ({
      checklists: state.checklists.map((c) =>
        c.id !== checklistId
          ? c
          : {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, isCompleted: !i.isCompleted } : i
              ),
              updatedAt: new Date(),
            }
      ),
    })),
  addChecklistItem: (checklistId, item) =>
    set((state) => ({
      checklists: state.checklists.map((c) =>
        c.id !== checklistId
          ? c
          : {
              ...c,
              items: [...c.items, item],
              updatedAt: new Date(),
          }
      ),
    })),
    updateChecklistTitle: (checklistId, title) =>
      set((state) => ({
        checklists: state.checklists.map((c) =>
          c.id !== checklistId ? c : { ...c, title, updatedAt: new Date() }
      ),
      })),
      updateChecklistItem: (checklistId, itemId, text) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id !== checklistId ? c : {
              ...c,
              items: c.items.map((i) => i.id === itemId ? { ...i, text } : i),
              updatedAt: new Date(),
            }
          ),
        })),
      deleteChecklistItem: (checklistId, itemId) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id !== checklistId ? c : {
              ...c,
              items: c.items.filter((i) => i.id !== itemId),
              updatedAt: new Date(),
            }
        ),
      })),
      updateChecklistPriority: (checklistId, priority) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id !== checklistId ? c : { ...c, priority, updatedAt: new Date() }
          ),
      })),
      archiveChecklist: (id) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === id ? { ...c, archived: true, updatedAt: new Date() } : c
          ),
        })),
});