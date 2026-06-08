import { useLocalSearchParams, Stack, router } from "expo-router";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useNoteStore } from "@/store/notesStore";
import { color, spacing, radius, typography, useAppTheme, getIdeaColor } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { useEffect, useState } from "react";

export default function IdeaDetail() {
    const theme = useAppTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const idea = useNoteStore((state) => state.ideas.find((i) => i.id === id));
    const archiveIdea = useNoteStore((state) => state.archiveIdea);
    const updateIdea = useNoteStore((state) => state.updateIdea);
    const [contentValue, setContentValue] = useState(idea?.content ?? '');

    if (!idea) {
        return (
            <View style={[styles.notFound, { backgroundColor: theme.colors.background }]}> 
                <Text style={[styles.notFoundText, { color: theme.colors.textMuted }]}>Idea no encontrada</Text>
            </View>
        );
    }

    const accentColor = getIdeaColor(idea.color, theme.dark);
    const formattedDate = new Date(idea.updatedAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <>
            <Stack.Screen options={{ title: idea.title }} />
            <View style={[styles.page, { backgroundColor: theme.colors.background }]}> 
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={[styles.heroCard, { backgroundColor: accentColor }]}> 
                        <View style={styles.heroHeader}> 
                            <View>
                                <Text style={[styles.heroLabel, { color: theme.colors.textMuted }]}>IDEA</Text>
                                <Text style={[styles.heroTitle, { color: theme.colors.text }]} numberOfLines={2}>{idea.title}</Text>
                            </View>
                            <Pressable onPress={() => { archiveIdea(idea.id); router.back(); }} style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed, { borderColor: theme.colors.border }]}> 
                                <Ionicons name="archive-outline" size={22} color={theme.colors.textMuted} />
                            </Pressable>
                        </View>
                        <View style={styles.heroTagRow}>
                            {idea.tags.slice(0, 4).map((tag) => (
                                <View key={tag} style={[styles.tagBubble, { backgroundColor: theme.colors.surface }]}> 
                                    <Text style={[styles.tagText, { color: theme.colors.text }]}>#{tag}</Text>
                                </View>
                            ))}
                            {idea.tags.length > 4 ? (
                                <View style={[styles.tagBubble, { backgroundColor: theme.colors.surface }]}> 
                                    <Text style={[styles.tagText, { color: theme.colors.text }]}>+{idea.tags.length - 4}</Text>
                                </View>
                            ) : null}
                        </View>
                        <View style={[styles.accentStrip, { backgroundColor: theme.colors.surface }]} />
                    </View>

                    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Detalles</Text>
                            <Text style={[styles.sectionHint, { color: theme.colors.textMuted }]}>Actualizado</Text>
                        </View>
                        <Text style={[styles.detailText, { color: theme.colors.text }]}>{formattedDate}</Text>
                        <View style={styles.location}>
                            <Ionicons name="location-outline" size={16} color={theme.colors.textMuted} /> 
                            <Text style={[styles.locationText, { color: theme.colors.textMuted }]}>{idea.location_name ?? "Sin ubicación"}</Text>
                        </View>
                        <View style={styles.divider} />
                        <Text style={[styles.sectionSubtitle, { color: theme.colors.textMuted }]}>Descripción</Text>
                        <TextInput
                            style={[styles.bodyText, { color: theme.colors.text }]}
                            value={contentValue}
                            onChangeText={setContentValue}
                            placeholder="Escribe más detalles sobre tu idea..."
                            placeholderTextColor={theme.colors.textMuted}
                            multiline
                            returnKeyType="done"
                            blurOnSubmit={true}
                            onBlur={() => {
                                updateIdea(idea.id, { content: contentValue });
                            }}
                            onSubmitEditing={() => {
                                updateIdea(idea.id, { content: contentValue });
                            }}
                        />
                    </View>

                    <Pressable onPress={() => { archiveIdea(idea.id); router.back(); }} style={({ pressed }) => [styles.archiveButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, opacity: pressed ? 0.85 : 1 }]}> 
                        <Ionicons name="archive-outline" size={18} color={theme.colors.primary} />
                        <Text style={[styles.archiveButtonText, { color: theme.colors.primary }]}>Archivar idea</Text>
                    </Pressable>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    scrollContainer: {
        padding: spacing[4],
        paddingBottom: spacing[10],
    },
    notFound: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    notFoundText: {
        fontSize: typography.fontSize.lg,
    },
    heroCard: {
        borderRadius: radius.xl,
        padding: spacing[5],
        marginBottom: spacing[4],
        shadowColor: color.neutral[900],
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
    },
    heroHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: spacing[4],
    },
    heroLabel: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: spacing[2],
    },
    heroTitle: {
        fontSize: typography.fontSize["3xl"],
        fontWeight: typography.fontWeight.bold,
        lineHeight: 40,
    },
    iconButton: {
        width: 46,
        height: 46,
        borderRadius: radius.full,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.12)",
    },
    iconButtonPressed: {
        opacity: 0.8,
    },
    heroTagRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing[2],
    },
    tagBubble: {
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        borderRadius: radius.full,
        borderWidth: 1,
    },
    tagText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
    },
    accentStrip: {
        height: 4,
        borderRadius: radius.full,
        marginTop: spacing[4],
    },
    card: {
        borderRadius: radius.xl,
        padding: spacing[5],
        borderWidth: 1,
        marginBottom: spacing[4],
        shadowColor: color.neutral[900],
        shadowOpacity: 0.04,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing[3],
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
    },
    sectionHint: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
    },
    detailText: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
        marginBottom: spacing[4],
    },
    divider: {
        height: 1,
        backgroundColor: color.neutral[100],
        marginBottom: spacing[4],
    },
    sectionSubtitle: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        textTransform: "uppercase",
        letterSpacing: 0.7,
        marginBottom: spacing[2],
    },
    bodyText: {
        fontSize: typography.fontSize.md,
        lineHeight: 24,
    },
    archiveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing[2],
        padding: spacing[4],
        borderRadius: radius.xl,
        borderWidth: 1,
    },
    archiveButtonText: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
    },
    location:{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing[2],
        marginBottom: spacing[2],
    },
    locationText:{
        fontSize: typography.fontSize.sm,
    }
});