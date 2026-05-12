import { Dimensions, View, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useNoteStore } from "@/store/notesStore";
import IdeaCard from "@/components/items/IdeaCard";
import { useEffect } from "react";
import EmptyState from "@/components/EmptyState";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import { useAppTheme, typography, spacing } from "@/constants/theme";

const NUM_COLUMNS = 2;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / NUM_COLUMNS;

export default function IdeasScreen() {
    const theme = useAppTheme();
    const ideas = useNoteStore((state) => state.ideas);
    const addIdea = useNoteStore((state) => state.addIdea);
    const [search, setSearch] = useState("");
    const filtered = ideas.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())));

    useEffect(() => {}, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar ideas..."
            />
            {ideas.length > 0 && (
                <Text style={[styles.counter, { color: theme.colors.textMuted }] }>
                    {filtered.length} {filtered.length === 1 ? "idea" : "ideas"}
                        </Text>
            )}
            {filtered.length === 0 && search.length === 0 ? (
                <EmptyState
                    icon="document-text-outline"
                    title="No hay ideas"
                    subtitle="Pulsa + para plasmar tu primera idea!"
                />
            ) : filtered.length === 0 && search.length > 0 ? (
                <EmptyState
                    icon="search-outline"
                    title="Sin resultados"
                    subtitle={`No hay ideas que coincidan con "${search}"`}
                            />
                        ) : (
            <FlashList
                data={filtered}
                numColumns={NUM_COLUMNS}
                renderItem={({ item }) => (
                    <IdeaCard 
                        idea={item}
                        onPress={() => router.push(`/ideas/${item.id}`)} 
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        padding: 16,
    },
    container: {
        flex: 1,
    },
    counter: {
        fontSize: typography.fontSize.xs,
        marginHorizontal: spacing[4],
        marginBottom: spacing[1],
    }
});