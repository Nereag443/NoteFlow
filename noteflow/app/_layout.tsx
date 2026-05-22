import { useNoteStore } from "@/store/notesStore";
import { Stack } from "expo-router";
import { ActivityIndicator, PaperProvider } from "react-native-paper";
import { View, useColorScheme } from "react-native";
import { color, lightTheme, darkTheme } from "@/constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";

export default function RootLayout() {
  const themeMode = useNoteStore((state) => state.themeMode);
  const fetchNotes = useNoteStore((state) => state.fetchNotes);
  const fetchChecklists = useNoteStore((state) => state.fetchChecklists);
  const fetchIdeas = useNoteStore((state) => state.fetchIdeas);
  const isLoadingNotes = useNoteStore((state) => state.isLoadingNotes)
  const colorScheme = useColorScheme();
  const resolvedScheme =
    themeMode === "system" ? colorScheme : themeMode;
  const theme = resolvedScheme === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    fetchNotes();
    fetchChecklists();
    fetchIdeas();
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeLegibility;
            }
            input:focus, textarea:focus {
                outline: 2px solid ${theme.colors.primary} !important;
                border-radius: 4px !important;
                padding: 4px !important;
            }
        `;
        document.head.appendChild(style);
    }
  }), [theme.colors.primary];

  if(isLoadingNotes) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={color.primary[500]} />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <PaperProvider theme={theme}>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { color: theme.colors.text },
        headerShadowVisible: false,
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="new-note" options={{ presentation: "modal", title: "Nueva nota "}} />
        <Stack.Screen name="notas/[id]" options={{ title: "Nota" }} />
        <Stack.Screen name="checklists/[id]" options={{ title: "Checklist" }} />
        <Stack.Screen name="ideas/[id]" options={{ title: "Idea" }} />
        <Stack.Screen name="archived" options={{ title: "Archivados" }} />
      </Stack>
      {isLoadingNotes && (
        <View style={{ 
          position: "absolute", flex: 1, width: "100%", height: "100%",
          justifyContent: "center", alignItems: "center",
          backgroundColor: theme.colors.background 
        }}>
          <ActivityIndicator size="large" color={color.primary[500]} />
        </View>
      )}
    </PaperProvider>
    </GestureHandlerRootView>
  );
}