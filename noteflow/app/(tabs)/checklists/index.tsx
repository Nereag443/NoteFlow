import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useNoteStore } from "@/store/notesStore";
import ChecklistCard from "@/components/items/CheckListCard";
import { Checklist } from "@/types";
import EmptyState from "@/components/EmptyState";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";

export default function ChecklistScreen() {
    const checklists = useNoteStore((state) => state.checklists)
    const [search, setSearch] = useState("")
    const filtered = checklists.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()));
    return (
        <View style={styles.container}>
            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar tareas"
            />
            {filtered.length === 0 && search.length === 0 ? (
                <EmptyState
                    icon="checkbox-outline"
                    title="No hay tareas"
                    subtitle="Pulsa + para crear tu primera lista de tareas!"
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
});