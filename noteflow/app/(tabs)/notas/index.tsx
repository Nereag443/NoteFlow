import { View, StyleSheet } from "react-native";
import { router } from "expo-router"
import { FlashList } from "@shopify/flash-list";
import { useNoteStore } from "@/store/notesStore";
import NoteCard from "@/components/items/NoteCard";
import { Note } from "@/types";
import EmptyState from "@/components/EmptyState";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";

export default function NotasScreen() {
    const notes = useNoteStore((state) => state.notes);
    const [search, setSearch] = useState("");
    const filtered = notes.filter((n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase()));
    return (
        <View style={styles.container}>
            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar notas..."
            />
            {filtered.length === 0 && search.length === 0 ? (
                <EmptyState
                    icon="document-text-outline"
                    title="No hay notas"
                    subtitle="Pulsa + para crear tu primera nota!"
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
        flex: 1
    },
    list: {
        paddingVertical: 8
    }
})