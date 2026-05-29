import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useNoteStore } from "@/store/notesStore";
import { color, typography, spacing, radius, useAppTheme } from "@/constants/theme";
import { useState } from "react";

export default function NoteDetail() {
    const theme = useAppTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const note = useNoteStore((state) => state.notes.find((n) => n.id === id));

    if (!note) {
        return (
            <View style={[styles.notFound, { backgroundColor: theme.colors.background }]}> 
                <Text style={[styles.notFoundText, { color: theme.colors.textMuted }]}>Nota no encontrada</Text>
            </View>
        );
    }

    const updateNote = useNoteStore((state) => state.updateNote);
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState(note.title);
    const [contentValue, setContentValue] = useState(note.content);

    const updatedDate = new Date(note.updatedAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const createdDate = new Date(note.createdAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <>
            <Stack.Screen options={{ title: editingTitle ? "Editando..." : note.title }} />
            <ScrollView contentContainerStyle={styles.scrollContainer} style={{ backgroundColor: theme.colors.background }}>
                <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
                    <View style={styles.headerRow}>
                        <View style={styles.titleBlock}>
                            <Text style={[styles.metaLabel, { color: theme.colors.textMuted }]}>Nota</Text>
                            {editingTitle ? (
                                <TextInput
                                    style={[styles.titleInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
                                    value={titleValue}
                                    onChangeText={setTitleValue}
                                    autoFocus
                                    returnKeyType="done"
                                    onBlur={() => {
                                        updateNote(note.id, { title: titleValue.trim() || note.title });
                                        setEditingTitle(false);
                                    }}
                                    onSubmitEditing={() => {
                                        updateNote(note.id, { title: titleValue.trim() || note.title });
                                        setEditingTitle(false);
                                    }}
                                />
                            ) : (
                                <Pressable onPress={() => setEditingTitle(true)}>
                                    <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>{note.title}</Text>
                                </Pressable>
                            )}
                        </View>
                        <Pressable onPress={() => setEditingTitle(true)} style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed, { borderColor: theme.colors.border }]} > 
                            <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>Editar</Text>
                        </Pressable>
                    </View>

                    <View style={styles.metaRow}>
                        <Text style={[styles.metaText, { color: theme.colors.textMuted }]}>Actualizado: {updatedDate}</Text>
                        <Text style={[styles.metaText, { color: theme.colors.textMuted }]}>Creado: {createdDate}</Text>
                    </View>
                </View>

                <View style={[styles.contentCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contenido</Text>
                    <Text style={[styles.sectionHint, { color: theme.colors.textMuted }]}>Toca para escribir o actualizar... </Text>
                    <TextInput
                        style={[styles.content, { color: theme.colors.text }]}
                        value={contentValue}
                        onChangeText={(text) => {
                            setContentValue(text);
                            updateNote(note.id, { content: text });
                        }}
                        multiline
                        placeholder="Escribe aquí tu nota..."
                        placeholderTextColor={theme.colors.textMuted}
                        textAlignVertical="top"
                    />
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
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
    card: {
        borderRadius: radius.xl,
        padding: spacing[5],
        marginBottom: spacing[4],
        borderWidth: 1,
        shadowColor: color.neutral[900],
        shadowOpacity: 0.05,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    titleBlock: {
        flex: 1,
        marginRight: spacing[4],
    },
    metaLabel: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: spacing[2],
    },
    title: {
        fontSize: typography.fontSize["3xl"],
        fontWeight: typography.fontWeight.bold,
        lineHeight: 40,
    },
    titleInput: {
        fontSize: typography.fontSize["3xl"],
        fontWeight: typography.fontWeight.bold,
        borderBottomWidth: 1,
        paddingVertical: spacing[1],
        marginBottom: spacing[1],
    },
    editButton: {
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        borderWidth: 1,
        borderRadius: radius.full,
        justifyContent: "center",
        alignItems: "center",
    },
    editButtonPressed: {
        opacity: 0.8,
    },
    editButtonText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
    },
    metaRow: {
        marginTop: spacing[4],
        gap: spacing[2],
    },
    metaText: {
        fontSize: typography.fontSize.sm,
    },
    contentCard: {
        borderRadius: radius.xl,
        padding: spacing[5],
        borderWidth: 1,
        marginBottom: spacing[4],
        shadowColor: color.neutral[900],
        shadowOpacity: 0.04,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing[1],
    },
    sectionHint: {
        fontSize: typography.fontSize.xs,
        marginBottom: spacing[4],
    },
    content: {
        minHeight: 260,
        fontSize: typography.fontSize.md,
        lineHeight: 26,
        padding: 0,
        margin: 0,
    },
    tipCard: {
        borderRadius: radius.xl,
        padding: spacing[4],
        borderWidth: 1,
    },
    tipTitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing[2],
    },
    tipText: {
        fontSize: typography.fontSize.md,
        lineHeight: 22,
    },
});
