import { View, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useNoteStore } from "@/store/notesStore";
import ChecklistCard from "@/components/items/CheckListCard";
import { Checklist } from "@/types";
import EmptyState from "@/components/EmptyState";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { typography, spacing, useAppTheme } from "@/constants/theme";

export default function ChecklistScreen() {
    const theme = useAppTheme();
    const checklists = useNoteStore((state) => state.checklists)
    const [search, setSearch] = useState("")
    const filtered = checklists.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()));
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar tareas"
            />
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
    }
});