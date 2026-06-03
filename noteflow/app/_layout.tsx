import { useNoteStore } from "@/store/notesStore";
import { Stack, router } from "expo-router";
import { ActivityIndicator, PaperProvider } from "react-native-paper";
import { View, useColorScheme, Platform } from "react-native";
import { color, lightTheme, darkTheme } from "@/constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from "@react-native-firebase/auth";

export default function RootLayout() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null | undefined>(undefined);
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
    if(Platform.OS === "web"){
      setUser(null);
      return;
    }
    const firebaseAuth = getAuth();
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
    if(firebaseUser){
      fetchNotes();
      fetchChecklists();
      fetchIdeas();
      router.replace("/(tabs)/notas");
    }else {
      router.replace("/auth/login");
    }
  });
  return unsubscribe;
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
        <Stack.Screen name="auth/login/index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register/index" options={{ headerShown: false }} />
        <Stack.Screen name="new-note" options={{ presentation: "modal", title: "Nueva nota "}} />
        <Stack.Screen name="notas/[id]" options={{ title: "Nota" }} />
        <Stack.Screen name="checklists/[id]" options={{ title: "Checklist" }} />
        <Stack.Screen name="ideas/[id]" options={{ title: "Idea" }} />
        <Stack.Screen name="archived" options={{ title: "Archivados" }} />
        <Stack.Screen name="profile" options={{ title: "Perfil" }} />
      </Stack>
      {(user === undefined || isLoadingNotes) && (
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