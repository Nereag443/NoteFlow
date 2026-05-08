import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useNoteStore } from "@/store/notesStore";
import { color, typography, spacing, radius } from "@/constants/theme";

export default function ChecklistDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const note = useNoteStore((state) =>
        state.notes.find((n) => n.id === id)
    );
    const deleteNote = useNoteStore((state) => state.deleteNote)
    if(!note) {
        return (
            <View style={styles.notFound}>
                <Text style={styles.notFoundText}>
                    Nota no encontrada
                </Text>
            </View>
        );
    }
    const handleDelete = () => {
        deleteNote(note.id);
        router.back();
    }
    return (
        <>
            <Stack.Screen
                options={{
                    title: `Notas #${id}`,
                }}
            />
            <ScrollView style={styles.container}>
                <Text style={styles.date}>
                {new Date(note.updatedAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}
                </Text>
                <Text style={styles.deleteButton} onPress={handleDelete}>
                    {note.content}
                </Text>
                <Pressable style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>Eliminar nota</Text>
                </Pressable>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        padding: spacing[4],
        backgroundColor: color.neutral[50],
    },
    date: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[400],
        marginBottom: spacing[4],
    },
    content: {
        fontSize: typography.fontSize.md,
        color: color.neutral[900],
        lineHeight: 24,
        marginBottom: spacing[8],
    },
    deleteButton: {
        padding: spacing[3],
        borderRadius: radius.md,
        backgroundColor: color.neutral[100],
        alignItems: "center",
        marginBottom: spacing[8],
    },
    deleteButtonText: {
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
})