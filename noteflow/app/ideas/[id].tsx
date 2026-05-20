import { useLocalSearchParams, Stack, router } from "expo-router";
import { View, Text, StyleSheet, Pressable, Alert, Platform } from "react-native";
import { useNoteStore } from "@/store/notesStore";
import { color, spacing, radius, typography, useAppTheme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function IdeaDetail() {
    const theme = useAppTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const idea = useNoteStore((state) => state.ideas.find((i) => i.id === id));
    const archiveIdea = useNoteStore((state) => state.archiveIdea);
    if (!idea) {
    return (
        <View style={styles.notFound}>
            <Text style={styles.notFoundText}>Idea no encontrada</Text>
        </View>
    );
    }
    
    return (
        <>
        <Stack.Screen options={{ title: idea.title }} />
        <View style={[styles.page, { backgroundColor: theme.colors.background }]}> 
          <View style={[styles.container, { backgroundColor: idea.color }]}> 
            <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{idea.title}</Text>
            <Pressable onPress={() => { archiveIdea(idea.id); router.back(); }}>
                <Ionicons name="archive-outline" size={22} color={theme.colors.textMuted} />
            </Pressable>
            </View>
            <View style={styles.tags}>
                {idea.tags.map((tag) => (
                    <View key={tag} style={[styles.chip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
                        <Text style={[styles.chipText, { color: theme.colors.text }]}>{tag}</Text>
                    </View>
                ))}
            </View>
            <Text style={[styles.date, { color: theme.colors.textMuted }]}> 
                {new Date(idea.updatedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
            </Text>
          </View>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    page: {
      flex: 1,
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
    archiveButton: {
        padding: spacing[3],
        borderRadius: radius.md,
        alignItems: "center",
        borderWidth: 1,
        marginBottom: spacing[2],
    },
    archiveButtonText: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing[4],
    },
});