import { Dimensions, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useNoteStore } from "@/store/notesStore";
import IdeaCard from "@/components/items/IdeaCard";
import { useEffect } from "react";

const NUM_COLUMNS = 2;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / NUM_COLUMNS;

export default function IdeasScreen() {
    const ideas = useNoteStore((state) => state.ideas);
    const addIdea = useNoteStore((state) => state.addIdea);

    useEffect(() => {
        if (ideas.length === 0) {
            addIdea({
                id: "1",
                title: "Ejemplo de idea",
                tags: ["ejemplo", "idea"],
                color: "#FFD700",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            addIdea({
                id: "2",
                title: "Otra idea",
                tags: ["otra", "idea"],
                color: "#ADFF2F",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    }, []);

    return (
        <View style={styles.container}>
            <FlashList
                data={ideas}
                renderItem={({ item }) => <IdeaCard idea={item} onPress={() => router.push(`/ideas/${item.id}`)} />}
                keyExtractor={(item) => item.id}
                numColumns={NUM_COLUMNS}
                contentContainerStyle={styles.list}
            />
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
});