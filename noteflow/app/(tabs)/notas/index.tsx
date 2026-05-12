import { View, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useNoteStore } from "@/store/notesStore";
import NoteCard from "@/components/items/NoteCard";
import { Note } from "@/types";
import EmptyState from "@/components/EmptyState";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { typography, spacing, useAppTheme } from "@/constants/theme";

export default function NotasScreen() {
    const notes = useNoteStore((state) => state.notes);
    const [search, setSearch] = useState("");
    const filtered = notes.filter((n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase()));
    const theme = useAppTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar notas..."
            />
            {notes.length > 0 && (
                <Text style={[styles.counter, { color: theme.colors.textMuted }] }>
                    {filtered.length} {filtered.length === 1 ? "nota" : "notas"}
                </Text>
            )}
            {filtered.length === 0 && search.length === 0 ? (
                <EmptyState
                    icon="document-text-outline"
                    title="No hay notas"
                    subtitle="Pulsa + para crear tu primera nota!"
                />
            ) : filtered.length === 0 && search.length > 0 ? (
                <EmptyState
                    icon="search-outline"
                    title="Sin resultados"
                    subtitle={`No hay notas que coincidan con "${search}"`}
                />
            ) : (
            <FlashList
                data={filtered}
                renderItem={({item}: {item: Note}) =>(
                    <NoteCard
                        note={item}
                        onPress={() => router.push(`/notas/${item.id}`)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
            )}
        </View>
    );
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
    },
    list: {
        paddingVertical: spacing[2],
        paddingBottom: spacing[16],
    },
    counter: {
        fontSize: typography.fontSize.xs,
        marginHorizontal: spacing[4],
        marginBottom: spacing[1],
    }
})