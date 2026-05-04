import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function IdeaDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <>
            <Stack.Screen
                options={{
                    title: `Idea #${id}`,
                }}
            />
            <View>
                <Text>{`Idea #${id}`}</Text>
            </View>
        </>
    );   
}