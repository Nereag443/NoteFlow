import { useLocalSearchParams, Stack, router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNoteStore } from "@/store/notesStore";
import { color, spacing, radius, typography } from "@/constants/theme";

export default function IdeaDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const idea = useNoteStore((state) => state.ideas.find((i) => i.id === id));
    const deleteIdea = useNoteStore((state) => state.deleteIdea);

    if (!idea) {
    return (
        <View style={styles.notFound}>
            <Text style={styles.notFoundText}>Idea no encontrada</Text>
        </View>
    );
    }
    const handleDelete = () => {
        deleteIdea(idea.id);
        router.back();
    };
    
    return (
        <>
        <Stack.Screen options={{ title: idea.title }} />
        <View style={[styles.container, { backgroundColor: idea.color }]}>
            <Text style={styles.title}>{idea.title}</Text>
            <View style={styles.tags}>
                {idea.tags.map((tag) => (
                    <View key={tag} style={styles.chip}>
                        <Text style={styles.chipText}>{tag}</Text>
                    </View>
                ))}
            </View>
            <Text style={styles.date}>
                {new Date(idea.updatedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
            </Text>
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Eliminar</Text>
            </Pressable>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    notFound: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    notFoundText: {
        fontSize: typography.fontSize.lg,
        color: color.neutral[400],
    },
    container: {
        flex: 1,
        padding: spacing[6],
    },
    title: {
        fontSize: typography.fontSize["3xl"],
        fontWeight: typography.fontWeight.bold,
        color: color.neutral[900],
        marginBottom: spacing[4],
    },
    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing[2],
        marginBottom: spacing[4],
    },
    chip: {
        backgroundColor: color.neutral[200],
        borderRadius: radius.full,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
    },
    chipText: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[900],
    },
    date: {
        fontSize: typography.fontSize.sm,
        color: color.neutral[600],
        marginBottom: spacing[8],
    },
    deleteButton: {
        backgroundColor: "rgba(0,0,0,0.1)",
        padding: spacing[3],
        borderRadius: radius.md,
        alignItems: "center",
    },
    deleteButtonText: {
        color: color.semantic.error,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
    },
});