import { View, Text, StyleSheet, Pressable, Alert, Platform, TextInput } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useNoteStore } from "@/store/notesStore";
import { color, typography, spacing, radius, useAppTheme } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import { useState } from "react";

export default function ChecklistDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const checklist = useNoteStore((state) => state.checklists.find((c) => c.id ===id));
    const theme = useAppTheme();
    const toggleItem = useNoteStore((state) => state.toggleChecklistItem);
    const deleteChecklist = useNoteStore((state) => state.deleteChecklist);
    const addChecklistItem = useNoteStore((state) => state.addChecklistItem);
    const [newItem, setNewItem] = useState("");

    if (!checklist) {
        return (
            <View style={[styles.notFound, { backgroundColor: theme.colors.background }]}> 
                <Text style={[styles.notFoundText, { color: theme.colors.textMuted }]}>Lista no encontrada</Text>
            </View>
        );
    }

    const handleDelete = () => {
      if (Platform.OS === 'web') {
        const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta lista?");
        if (confirmed) {
          deleteChecklist(checklist.id);
          router.back();
        }
      } else {
        Alert.alert(
                "Eliminar lista",
                "¿Estás seguro de que quieres eliminar esta lista?",
                [
                    {
                        text: "Cancelar", style: "cancel"
                    },
                    {
                        text: "Eliminar",
                        style: "destructive",
                        onPress: () => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            deleteChecklist(checklist.id);
                            router.back();
                        }
                    }
                ]
            )
      }
    };

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
      addChecklistItem(checklist.id, {
        id: Math.random().toString(36).slice(2),
        text: newItem.trim(),
        isCompleted: false,
      });
      setNewItem("");
    }
    return (
        <>
            <Stack.Screen options={{ title: checklist.title }} />
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
                <Text style={[styles.counter, { color: theme.colors.textMuted }]}>{completed}/{total} completadas</Text>
                <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}> 
                    <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: theme.colors.primary }]} />
                </View>

                {checklist.items.map((item) => (
                <Pressable
                    key={item.id}
                    style={[styles.item, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}
                    onPress={() => handleToggle(item.id)}
                >
                    <View style={[styles.checkbox, item.isCompleted && styles.checkboxDone, { borderColor: theme.colors.primary, backgroundColor: item.isCompleted ? theme.colors.primary : 'transparent' }]} />
                    <Text style={[styles.itemText, item.isCompleted && styles.itemTextDone, { color: item.isCompleted ? theme.colors.textMuted : theme.colors.text }]}>
                    {item.text}
                    </Text>
                </Pressable>
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

                <Pressable style={[styles.deleteBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={handleDelete}>
                <Text style={[styles.deleteBtnText, { color: color.semantic.error }]}>Eliminar lista</Text>
                </Pressable>
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
  deleteBtn: {
    marginTop: spacing[2],
    padding: spacing[3],
    borderRadius: radius.md,
    backgroundColor: color.neutral[100],
    alignItems: "center",
  },
  deleteBtnText: {
    fontSize: typography.fontSize.md,
    color: color.semantic.error,
    fontWeight: typography.fontWeight.semibold,
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
});