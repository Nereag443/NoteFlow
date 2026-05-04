import { View } from "react-native";
import { Text } from "react-native";
import { router } from "expo-router";
import { Button } from "react-native-paper";

export default function IdeasScreen() {
    return (
        <View>
            <Button onPress={() => router.push("/noteflow/new-note/create")}>
                Ver nota
            </Button>
            <Button onPress={() => router.push("/noteflow/new-note/create")}>
                Crear nueva nota
            </Button>
        </View>
    )
}