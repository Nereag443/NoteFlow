import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useNoteStore } from "@/store/notesStore";
import ChecklistCard from "@/components/items/CheckListCard";
import { Checklist } from "@/types";

export default function ChecklistScreen() {
    const checklists = useNoteStore((state) => state.checklists)
    return (
        <View style={styles.container}>
            <FlashList
                data={checklists}
                renderItem={({ item }: { item: Checklist }) => (
                    <ChecklistCard
                        checklist={item}
                        onPress={() => router.push(`/checklists/${item.id}`)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
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