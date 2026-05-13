import { useNoteStore } from "@/store/notesStore";
import { Stack } from "expo-router";
import { ActivityIndicator, PaperProvider } from "react-native-paper";
import { View, useColorScheme } from "react-native";
import { color, lightTheme, darkTheme } from "@/constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const hasHydrated = useNoteStore((state) => state._hasHydrated);
  const themeMode = useNoteStore((state) => state.themeMode);
  const colorScheme = useColorScheme();
  const resolvedScheme =
    themeMode === "system" ? colorScheme : themeMode;
  const theme = resolvedScheme === "dark" ? darkTheme : lightTheme;

  if(!hasHydrated){
    return (
      <View style={{ flex:1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator size="large" color={color.primary[500]} />
      </View>
    )
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="new-note" options={{ presentation: "modal", title: "Nueva nota "}} />
      </Stack>
    </PaperProvider>
    </GestureHandlerRootView>
  );
}