import { Checklist } from "@/types";
import { StateCreator } from "zustand";

export interface ChecklistSlice {
  checklists: Checklist[];
  addChecklist: (checklist: Checklist) => void;
  deleteChecklist: (id: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
}

export const createChecklistSlice: StateCreator<ChecklistSlice> = (set) => ({
  checklists: [],
  addChecklist: (checklist) =>
    set((state) => ({ checklists: [...state.checklists, checklist] })),
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
});