import { Checklist, Priority, ChecklistItem } from "@/types";
import { StateCreator } from "zustand";
import * as api from "@/lib/api";
import { getCurrentLocation } from "@/lib/location";

export interface ChecklistSlice {
  checklists: Checklist[];
  isLoadingChecklists: boolean;
  errorChecklists: string | null;
  fetchChecklists: () => Promise<void>;
  addChecklist: (data: { title: string; priority?: Priority, deadline?: Date }) => Promise<any>;
  deleteChecklist: (id: string) => Promise<void>;
  toggleChecklistItem: (checklistId: string, itemId: string) => Promise<void>;
  addChecklistItem: (checklistId: string, text: string) => Promise<void>;
  updateChecklistTitle: (checklistId: string, title: string) => Promise<void>;
  updateChecklistItem: (checklistId: string, itemId: string, text: string) => Promise<void>;
  deleteChecklistItem: (checklistId: string, itemId: string) => Promise<void>;
  updateChecklistPriority: (checklistId: string, priority: Priority) => Promise<void>;
  archiveChecklist: (id: string) => Promise<void>;
  unarchiveChecklist: (id: string) => Promise<void>;
  updateChecklistDeadline: (checklistId: string, deadline: Date) => Promise<void>;
  updateChecklistNotificationId: (checklistId: string, notificationId: string | null) => void;
}

export const createChecklistSlice: StateCreator<ChecklistSlice> = (set, get) => ({
  checklists: [],
  isLoadingChecklists: false,
  errorChecklists: null,
  fetchChecklists: async () => {
    set({ isLoadingChecklists: true, errorChecklists: null });
    try {
        const checklists = await api.getChecklists();
        set({
            checklists: checklists.map((c: any) => ({
                ...c,
                items: c.items ?? [],
                createdAt: new Date(c.created_at),
                updatedAt: new Date(c.updated_at),
                deadline: c.deadline ? new Date(c.deadline) : null,
            }))
        });
    } catch {
        set({ errorChecklists: 'Error al cargar checklists' });
    } finally {
        set({ isLoadingChecklists: false });
    }
},
  addChecklist: async (data) => {
    try {
      const location = await getCurrentLocation();
      const checklist = await api.createChecklist({
        ...data,
        latitude: location?.latitude,
        longitude: location?.longitude,
        location_name: location?.locationName,
      });
      const normalized = {
        ...checklist,
        items: checklist.items ?? [],
        createdAt: new Date(checklist.created_at),
        updatedAt: new Date(checklist.updated_at),
      };
      set((state) => ({ checklists: [...state.checklists, normalized] }));
      return normalized;
    } catch {
      set({ errorChecklists: 'Error al crear checklist' });
    }
  },
  deleteChecklist: async (id) => {
    try {
      await api.deleteChecklist(id);
      set((state) => ({ checklists: state.checklists.filter((c) => c.id !== id),
    }));
  } catch {
    set({ errorChecklists: 'Error al eliminar checklist' });
  }
},
  toggleChecklistItem: async (checklistId, itemId) => {
    try {
      const checklist = get().checklists.find((c) => c.id === checklistId);
      if(!checklist) {
        return;
      }
      const item = checklist.items.find((i: ChecklistItem) => i.id === itemId);
      if(!item) {
        return
      }
      await api.updateChecklistItem(itemId, { is_completed: !item.isCompleted });
      set((state) => ({
        checklists: state.checklists.map((c) =>
          c.id !== checklistId
            ? c
            : {
                ...c,
                items: c.items.map((i) =>
                  i.id === itemId ? { ...i, isCompleted: !i.isCompleted } : i
                ),
              }
        ),
      }));
    } catch {
      set({ errorChecklists: 'Error al actualizar item' })
    }
  },
  addChecklistItem: async (checklistId, text) => {
    try {
      const item = await api.createChecklistItem(checklistId, text);
      set((state) => ({
        checklists: state.checklists.map((c) =>
          c.id !== checklistId
            ? c
            : {
              ...c,
              items: [...c.items, { id: item.id, text: item.text, isCompleted: item.is_completed}],
            }
        ),
      }));
    } catch {
      set({ errorChecklists: 'Error al añadir item' });
    }
  },
    updateChecklistTitle: async (checklistId, title) => {
      try {
        const updated = await api.updateChecklist(checklistId, { title });
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id !== checklistId ? c : { ...c, title: updated.title }
        ),
        }));
      } catch {
        set({ errorChecklists: 'Error al al actualizar título' });
      }
    },
      updateChecklistItem: async (checklistId, itemId, text) => {
        try {
          await api.updateChecklistItem(itemId, { text });
          set((state) => ({
            checklists: state.checklists.map((c) =>
              c.id !== checklistId ? c : {
                ...c,
                items: c.items.map((i) => i.id === itemId ? { ...i, text } : i),
              }
            ),
          }));
        } catch {
          set({ errorChecklists: 'Error al actulaizar item' });
        }
      },
      deleteChecklistItem: async (checklistId, itemId) => {
        try {
          await api.deleteChecklistItem(itemId);
          set((state) => ({
            checklists: state.checklists.map((c) =>
              c.id !== checklistId ? c : {
                ...c,
                items: c.items.filter((i) => i.id !== itemId),
              }
          ),
        }));
      } catch {
        set({ errorChecklists: 'Error al eliminar item' })
      }
    },
      updateChecklistPriority: async (checklistId, priority) => {
        try {
          const updated = await api.updateChecklist(checklistId, { priority });
          set((state) => ({
            checklists: state.checklists.map((c) =>
              c.id !== checklistId ? c : { ...c, priority: updated.priority }
            ),
        }));
      } catch {
        set({ errorChecklists: 'Error al actualizar prioridad' });
      }
    },
      archiveChecklist: async (id) => {
        try{
          const updated = await api.updateChecklist(id, { archived: true });
          set((state) => ({
            checklists: state.checklists.map((c) =>
              c.id === id ? { ...c, archived: updated.archived } : c
            ),
          }));
        } catch {
          set({ errorChecklists: 'Error al archivar checklist' });
        }
      },
      unarchiveChecklist: async (id) => {
        try {
          const updated = await api.updateChecklist(id, { archived: false });
          set((state) => ({
          checklists: state.checklists.map((c) =>
              c.id === id ? { ...c, archived: updated.archived } : c
          ),
          }));
        } catch {
          set({ errorChecklists: 'Error al desarchivar checklist' })
        }
      },
      updateChecklistDeadline: async (checklistId, deadline) => {
        try {
          await api.updateChecklist(checklistId, { deadline });
          set((state) => ({
            checklists: state.checklists.map((c) =>
              c.id !== checklistId ? c : { ...c, deadline, updatedAt: new Date() }
            ),
          }));
        } catch {
          set({ errorChecklists: 'Error al actualizar fecha límite' });
        }
      },
      updateChecklistNotificationId:(checklistId, notificationId) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id !== checklistId ? c : { ...c, notificationId }
          ),
      })),
});