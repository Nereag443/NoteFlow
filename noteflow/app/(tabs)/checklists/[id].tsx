import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useNoteStore } from "@/store/notesStore";
import { color, typography, spacing, radius, useAppTheme } from "@/constants/theme";
import * as Haptics from "expo-haptics";

export default function ChecklistDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const checklist = useNoteStore((state) => state.checklists.find((c) => c.id ===id));
    const theme = useAppTheme();
    const toggleItem = useNoteStore((state) => state.toggleChecklistItem);
    const deleteChecklist = useNoteStore((state) => state.deleteChecklist);

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
    const handleDelete = () => {
        deleteChecklist(checklist.id);
        router.back();
    };
    return (
        <>
            <Stack.Screen
                options={{
                    title: `Checklist #${id}`,
                }}
            />
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
  deleteBtn: {
    marginTop: spacing[8],
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
});