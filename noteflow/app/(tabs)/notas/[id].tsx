import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useNoteStore } from "@/store/notesStore";
import { color, typography, spacing, radius, useAppTheme } from "@/constants/theme";
import * as Haptics from "expo-haptics";

export default function ChecklistDetail() {
    const theme = useAppTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const note = useNoteStore((state) =>
        state.notes.find((n) => n.id === id)
    );
    const deleteNote = useNoteStore((state) => state.deleteNote)
    if(!note) {
        return (
            <View style={[styles.notFound, { backgroundColor: theme.colors.background }]}> 
                <Text style={[styles.notFoundText, { color: theme.colors.textMuted }]}> 
                    Nota no encontrada
                </Text>
            </View>
        );
    }
    const handleDelete = () => {
    Alert.alert(
        "Eliminar nota",
        "¿Estás seguro de que quieres eliminar esta nota?",
        [
            {
                text: "Cancelar", style: "cancel"
            },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    deleteNote(note.id);
                    router.back();
                }
            }
        ]
    )
}
    return (
        <>
            <Stack.Screen
                options={{
                    title: `Notas #${id}`,
                }}
            />
            <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
                <Text style={[styles.date, { color: theme.colors.textMuted }]}> 
                {new Date(note.updatedAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}
                </Text>
                <Text style={[styles.content, { color: theme.colors.text }]}> 
                    {note.content}
                </Text>
                <Pressable style={[styles.deleteButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={handleDelete}>
                    <Text style={[styles.deleteButtonText, { color: color.semantic.error }]}>Eliminar nota</Text>
                </Pressable>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        padding: spacing[4],
    },
    date: {
        fontSize: typography.fontSize.sm,
        marginBottom: spacing[4],
    },
    content: {
        fontSize: typography.fontSize.md,
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