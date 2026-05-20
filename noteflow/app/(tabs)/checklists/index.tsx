import { View, StyleSheet, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useNoteStore } from "@/store/notesStore";
import ChecklistCard from "@/components/items/CheckListCard";
import { Checklist } from "@/types";
import EmptyState from "@/components/EmptyState";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { typography, spacing, useAppTheme, color, radius } from "@/constants/theme";
import { Priority } from "@/types";

export default function ChecklistScreen() {
    const theme = useAppTheme();
    const checklists = useNoteStore((state) => state.checklists)
    const [search, setSearch] = useState("")
    const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
    const archiveChecklist = useNoteStore((state) => state.archiveChecklist);
    const filtered = checklists
        .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
        .filter((c) => priorityFilter === null || c.priority === priorityFilter)
        .filter((c) => !c.archived)
        .sort((a, b) => {
            const order = { high: 0, medium: 1, low: 2 };
            return order[a.priority ?? "low"] - order[b.priority ?? "low"];
        })
    const PRIORITY_FILTERS: { label: string; value: Priority | null }[] = [
        { label: "Todas", value: null },
        { label: "Alta", value: "high" },
        { label: "Media", value: "medium" },
        { label: "Baja", value: "low" },
];
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar tareas"
            />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
                style={{ flexGrow: 0, flexShrink: 0 }}
            >
                {PRIORITY_FILTERS.map((f) => {
                    const isActive = priorityFilter === f.value;
                    const chipColor = f.value ? color.priority[f.value] : theme.colors.primary;
                    return (
                        <Pressable
                            key={f.label}
                            onPress={() => setPriorityFilter(isActive && f.value !== null ? null : f.value)}
                            style={[
                                styles.chip,
                                { 
                                    backgroundColor: isActive ? chipColor : theme.colors.surface,
                                    borderColor: f.value ? chipColor : theme.colors.border,
                            },
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                { color: isActive ? color.neutral[0] : theme.colors.textMuted }
                            ]}>
                                {f.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
            {checklists.length > 0 && (
                <Text style={[styles.counter, { color: theme.colors.textMuted }] }>
                    {filtered.length} {filtered.length === 1 ? "checklist" : "listas"}
                </Text>
            )}
            {filtered.length === 0 && search.length === 0 ? (
                <EmptyState
                    icon="checkbox-outline"
                    title="No hay tareas"
                    subtitle="Pulsa + para crear tu primera lista de tareas!"
                />
            ) : filtered.length === 0 && search.length > 0 ? (
                <EmptyState
                    icon="search-outline"
                    title="Sin resultados"
                    subtitle={`No hay listas que coincidan con "${search}"`}
                 />
            ) : (
            <FlashList
                data={filtered}
                renderItem={({ item }: { item: Checklist }) => (
                    <ChecklistCard
                        checklist={item}
                        onPress={() => router.push(`/checklists/${item.id}`)}
                        onArchive={() => archiveChecklist(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
            )}
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1
    },
    list: {
        paddingVertical: 8
    },
    counter: {
        fontSize: typography.fontSize.xs,
        marginHorizontal: spacing[4],
        marginBottom: spacing[1],
    },
    filtersContainer: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[1],
        gap: spacing[2],
        alignItems: "center",
    },
    chip: {
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
        borderRadius: radius.full,
        borderWidth: 1,
    },
    chipText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
    }
});