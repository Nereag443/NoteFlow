import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Platform, TextInput } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useNoteStore } from "@/store/notesStore";
import { color, typography, spacing, radius, useAppTheme } from "@/constants/theme";
import { useState } from "react";

export default function ChecklistDetail() {
    const theme = useAppTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const note = useNoteStore((state) =>
        state.notes.find((n) => n.id === id)
    );
    if(!note) {
        return (
            <View style={[styles.notFound, { backgroundColor: theme.colors.background }]}> 
                <Text style={[styles.notFoundText, { color: theme.colors.textMuted }]}> 
                    Nota no encontrada
                </Text>
            </View>
        );
    }
    const updateNote = useNoteStore((state) => state.updateNote);
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState(note?.title ?? "");
    const [contentValue, setContentValue] = useState(note?.content ?? "");
    const LINES = 40;

    return (
        <>
            <Stack.Screen options={{ title: editingTitle ? "Editando..." : note.title }} />
            <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
                <View style={styles.contentContainer}>
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
                            <View style={[styles.titleWrapper, { borderColor: theme.colors.border }]}>
                            <Text style={[styles.title, { color: theme.colors.text }]}>{note.title}</Text>
                            </View>
                        </Pressable>
                )}
                <Text style={[styles.date, { color: theme.colors.textMuted }]}> 
                {new Date(note.updatedAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })} · Pulsa el título para editar
                </Text>
                <TextInput
                    style={[styles.content, { color: theme.colors.text }]}
                    value={contentValue}
                    onChangeText={(text) => {
                        setContentValue(text);
                        updateNote(note.id, { content: text });
                    }}
                    multiline
                    placeholder="Escribe aquí..."
                    placeholderTextColor={theme.colors.textMuted}
                    textAlignVertical="top"
                />
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
    },
    date: {
        fontSize: typography.fontSize.sm,
        marginBottom: spacing[4],
    },
    content: {
        fontSize: typography.fontSize.md,
        lineHeight: 28,
        minHeight: 500,
        padding: spacing[4],
        backgroundColor: "#fffdf7",
        borderRadius: radius.xl,
        borderLeftWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
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
    title: {
        fontSize: typography.fontSize["2xl"],
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing[1],
    },
    titleInput: {
        fontSize: typography.fontSize["2xl"],
        fontWeight: typography.fontWeight.bold,
        borderBottomWidth: 1,
        marginBottom: spacing[1],
        paddingVertical: spacing[1],
    },
    editHint: {
        fontSize: typography.fontSize.xs,
        marginBottom: spacing[4],
    },
    titleWrapper: {
        borderBottomWidth: 1,
        paddingBottom: spacing[1],
        marginBottom: spacing[1],
    },
    contentContainer: {
        padding: spacing[4],
    },
})