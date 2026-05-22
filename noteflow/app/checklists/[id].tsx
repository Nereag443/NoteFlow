import { View, Text, StyleSheet, Pressable, Alert, Platform, TextInput } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useNoteStore } from "@/store/notesStore";
import { color, typography, spacing, radius, useAppTheme } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Priority } from "@/types";

export default function ChecklistDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const checklist = useNoteStore((state) => state.checklists.find((c) => c.id ===id));
    const theme = useAppTheme();
    const toggleItem = useNoteStore((state) => state.toggleChecklistItem);
    const addChecklistItem = useNoteStore((state) => state.addChecklistItem);
    const [newItem, setNewItem] = useState("");
    const updateChecklistTitle = useNoteStore((state) => state.updateChecklistTitle);
    const updateChecklistItem = useNoteStore((state) => state.updateChecklistItem);
    const deleteChecklistItem = useNoteStore((state) => state.deleteChecklistItem);
    const updateChecklistPriority = useNoteStore((state) => state.updateChecklistPriority);
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState(checklist?.title ?? "");
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingItemText, setEditingItemText] = useState("");
    const PRIORITIES: { label: string; value: Priority; color: string }[] = [
      { label: "Baja", value: "low", color: color.priority.low },
      { label: "Media", value: "medium", color: color.priority.medium },
      { label: "Alta", value: "high", color: color.priority.high },
    ]

    if (!checklist) {
        return (
            <View style={[styles.notFound, { backgroundColor: theme.colors.background }]}> 
                <Text style={[styles.notFoundText, { color: theme.colors.textMuted }]}>Lista no encontrada</Text>
            </View>
        );
    }

    const completed = checklist.items.filter((i) => i.isCompleted).length;
    const total = checklist.items.length;
    const progress = total > 0 ? completed / total : 0;
    const handleToggle = (itemId: string) => {
      toggleItem(checklist.id, itemId);
      const updatedItems = checklist.items.map((i) =>
        i.id === itemId ? { ...i, isCompleted: !i.isCompleted } : i
      );
      const allCompleted = updatedItems.every((i) => i.isCompleted);
      if (allCompleted) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    };
    const addItem = () => {
      if(!newItem.trim()) return;
      addChecklistItem(checklist.id, newItem.trim());
      setNewItem("");
    }
    return (
        <>
            <Stack.Screen options={{ title: editingTitle ? "Editando..." : checklist.title }} />
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {editingTitle ? (
              <TextInput
                style={[styles.titleInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
                value={titleValue}
                onChangeText={setTitleValue}
                autoFocus
                selectionColor={theme.colors.primary}
                onBlur={() => {
                  updateChecklistTitle(checklist.id, titleValue.trim() || checklist.title);
                  setEditingTitle(false);
                }}
                returnKeyType="done"
                onSubmitEditing={() => {
                  updateChecklistTitle(checklist.id, titleValue.trim() || checklist.title);
                  setEditingTitle(false);
                }}
                
            />
            ) : (
              <>
              <Pressable onPress={() => setEditingTitle(true)}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{checklist.title}</Text>
              </Pressable>
                <Text style={[styles.editInfo, { color: theme.colors.textMuted }]}>Pulsa para editar el título</Text>
              </>
              )}
              <View style={styles.priorityContainer}>
                {PRIORITIES.map((p) => {
                  const isActive = checklist.priority === p.value;
                  return (
                    <Pressable
                      key={p.value}
                      onPress={() => updateChecklistPriority(checklist.id, p.value)}
                      style={[
                        styles.priorityChip,
                        {
                          backgroundColor: isActive ? p.color : theme.colors.surface,
                          borderColor: p.color,
                        }
                      ]}
                    >
                      <Text style={[styles.priorityChipText, { color: isActive ? color.neutral[0]: p.color }]}>
                        {p.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
                <Text style={[styles.counter, { color: theme.colors.textMuted }]}>{completed}/{total} completadas</Text>
                <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}> 
                    <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: theme.colors.primary }]} />
                </View>

                {checklist.items.map((item) => (
                  <View key={item.id} style={[styles.item, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
                  <Pressable onPress={() => handleToggle(item.id)}>
                    <View style={[styles.checkbox, item.isCompleted && styles.checkboxDone, { borderColor: theme.colors.primary, backgroundColor: item.isCompleted ? theme.colors.primary : 'transparent' }]} />
                  </Pressable>
                  {editingItemId === item.id ? (
                    <TextInput
                      style={[styles.itemInput, { color: theme.colors.text }]}
                      value={editingItemText}
                      onChangeText={setEditingItemText}
                      autoFocus
                      selectionColor={theme.colors.primary}
                      onBlur={() => {
                        updateChecklistItem(checklist.id, item.id, editingItemText.trim() || item.text);
                        setEditingItemId(null);
                      }}
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        updateChecklistItem(checklist.id, item.id, editingItemText.trim() || item.text);
                        setEditingItemId(null);
                      }}
                    />
                  ) : (
                    <>
                    <Text style={[styles.itemText, item.isCompleted && styles.itemTextDone, { color: item.isCompleted ? theme.colors.textMuted : theme.colors.text, flex: 1 }]}>
                      {item.text}
                    </Text>
                    <Pressable onPress={() => { setEditingItemId(item.id); setEditingItemText(item.text); }}>
                      <Ionicons name="pencil" size={18} color={theme.colors.textMuted} />
                    </Pressable>
                    </>
                  )}
                    <Pressable onPress={() => deleteChecklistItem(checklist.id, item.id)}>
                      <Ionicons name="close-circle-outline" size={20} color={theme.colors.textMuted} />
                    </Pressable>
            </View>
          ))}
                <View style={styles.inputContainer}>
                <View style={[styles.inputRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    value={newItem}
                    onChangeText={setNewItem}
                    placeholder="Nueva tarea..."
                    placeholderTextColor={theme.colors.textMuted}
                    onSubmitEditing={addItem}
                    returnKeyType="done"
                  />
                  </View>
                <Pressable style={[styles.addBtn, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]} onPress={addItem}>
                  <Text style={[styles.addBtnText, { color: theme.colors.onPrimary }]}>Agregar tarea</Text>
                </Pressable>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing[4],
  },
  counter: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing[2],
  },
  progressTrack: {
    height: 4,
    borderRadius: radius.full,
    marginBottom: spacing[4],
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    borderRadius: radius.full,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: color.neutral[200],
    padding: spacing[3],
    borderRadius: radius.sm, 
    marginBottom: spacing[1],
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: color.primary[500],
  },
  checkboxDone: {
    backgroundColor: color.primary[500],
  },
  itemText: {
    fontSize: typography.fontSize.md,
    color: color.neutral[900],
  },
  itemTextDone: {
    textDecorationLine: "line-through",
    color: color.neutral[400],
  },
  addBtn: {
    width: 100,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center"
  },
  addBtnText: {
    fontSize: typography.fontSize.md,
    color: color.neutral[900],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 24,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: typography.fontSize.lg,
    color: color.neutral[400],
  },
  inputContainer: {
    flexDirection: "row",
    gap: spacing[2],
    marginTop: spacing[4],
  },
  inputRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    padding: spacing[3],
    fontSize: typography.fontSize.md,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: color.neutral[900],
  },
  titleInput: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    borderBottomWidth: 1,
    marginBottom: spacing[4],
    paddingVertical: spacing[1],
  },
  itemInput: {
    flex: 1,
    fontSize: typography.fontSize.md,
  },
  editInfo: {
    marginBottom: spacing[3],
    fontSize: typography.fontSize.xs,
  },
  priorityContainer: {
    flexDirection: "row",
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  priorityChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    borderWidth: 1,
  },
  priorityChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
},
});