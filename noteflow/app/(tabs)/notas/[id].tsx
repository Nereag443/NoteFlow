import { View, Text } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";

export default function ChecklistDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <>
            <Stack.Screen
                options={{
                    title: `Notas #${id}`,
                }}
            />
            <View>
                <Text>{`Notas #${id}`}</Text>
            </View>
        </>
    );
}