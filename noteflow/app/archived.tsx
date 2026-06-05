import { View, Text, StyleSheet, SectionList, Pressable, Alert, Platform } from "react-native";
import { useNoteStore } from "@/store/notesStore";
import { useAppTheme, color, typography, spacing, radius } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { ArchiveSection } from "@/types";
import EmptyState from "@/components/EmptyState";

export default function ArchivedScreen() {
    const theme = useAppTheme();
    const notes = useNoteStore((state) => state.notes);
    const checklists = useNoteStore((state) => state.checklists);
    const ideas = useNoteStore((state) => state.ideas);
    const archivedNotes = notes.filter((n) => n.archived);
    const archivedChecklists = checklists.filter((c) => c.archived);
    const archivedIdeas = ideas.filter((i) => i.archived);
    const deleteNote = useNoteStore((state) => state.deleteNote);
    const deleteChecklist = useNoteStore((state) => state.deleteChecklist);
    const deleteIdea = useNoteStore((state) => state.deleteIdea);
    const unarchiveNote = useNoteStore((state) => state.unarchiveNote);
    const unarchiveChecklist = useNoteStore((state) => state.unarchiveChecklist);
    const unarchiveIdea = useNoteStore((state) => state.unarchiveIdea);
    const sections: ArchiveSection[] = [
        { title: "Notas", data: archivedNotes, type: "note" as const },
        { title: "Checklists", data: archivedChecklists, type: "checklist" as const },
        { title: "Ideas", data: archivedIdeas, type: "idea" as const },
    ]
    const filteredSections = sections.filter((s) => s.data.length > 0);
    const handleDelete = (id: string, type: string) => {
        const confirm = () => {
            if (type === "note") {
                deleteNote(id);
            } else if(type === "checklist") {
                deleteChecklist(id);
            } else {
                deleteIdea(id);
            }
        };
        if(Platform.OS === "web") {
            if(window.confirm("¿Eliminar permanentemente?")) {
                confirm();
            } 
        } else {
            Alert.alert("Eliminar", "¿Eliminar permanentemente?", [
                {text: "Cancelar", style: "cancel"},
                { text: "Eliminar", style: "destructive", onPress: confirm },
            ]);
        }
    };
    const handleUnarchive = (id: string, type: string) => {
        if(type === "note") {
            unarchiveNote(id);
        } else if(type === "checklist") {
            unarchiveChecklist(id);
        } else {
            unarchiveIdea(id);
        }
    };
    if(filteredSections.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <EmptyState
                    icon="archive-outline"
                    title="No hay elementos archivados"
                    subtitle="Los elementos que archives aparecerán aquí."
                />        
            </View>
        );
    }
    return (
        <SectionList
            style={{ backgroundColor: theme.colors.background }}
            contentContainerStyle={styles.list}
            sections={filteredSections}
            keyExtractor={(item) => item.id}
            renderSectionHeader={({ section }) => (
                <Text style={[styles.sectionTitle, { color: theme.colors.textMuted, backgroundColor: theme.colors.background }]}>
                    {section.title}
                </Text>
            )}
            renderItem={({ item, section }) => (
                <View style={[styles.item, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.actions}>
                        <Pressable onPress={() => handleUnarchive(item.id, section.type)} style={[styles.actionBtn, { borderColor: theme.colors.border }]}>
                            <Ionicons name="arrow-undo-outline" size={18} color={theme.colors.primary} />
                        </Pressable>
                        <Pressable onPress={() => handleDelete(item.id, section.type)} style={[styles.actionBtn, { borderColor: theme.colors.border }]}>
                            <Ionicons name="trash-outline" size={18} color={color.semantic.error} />
                        </Pressable>
                    </View>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        padding: spacing[4],
    },
    sectionTitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        marginTop: spacing[4],
        marginBottom: spacing[2],
        paddingVertical: spacing[1],
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacing[4],
        borderRadius: radius.xl,
        borderWidth: 1,
        marginBottom: spacing[2],
    },
    itemTitle: {
        flex: 1,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
        marginRight: spacing[3],
    },
    actions: {
        flexDirection: "row",
        gap: spacing[2],
    },
    actionBtn: {
        padding: spacing[2],
        borderRadius: radius.md,
        borderWidth: 1,
    },
    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: spacing[3],
    },
    emptyText: {
        fontSize: typography.fontSize.md,
    },
})