import { View, StyleSheet } from "react-native";
import { router } from "expo-router"
import { FlashList } from "@shopify/flash-list";
import { useNoteStore } from "@/store/notesStore";
import NoteCard from "@/components/items/NoteCard";
import { Note } from "@/types";

export default function NotasScreen() {
    const notes = useNoteStore((state) => state.notes);
    return (
        <View style={styles.container}>
            <FlashList
                data={notes}
                renderItem={({item}: {item: Note}) =>(
                    <NoteCard
                        note={item}
                        onPress={() => router.push(`/notas/${item.id}`)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
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