import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme, useIsDarkMode, color, typography } from "@/constants/theme";
import { useNoteStore } from "@/store/notesStore";
import { TabConfig } from "@/types";
import { router, usePathname } from "expo-router";

const TABS: TabConfig[] = [
  {
    name: "notas/index",
    title: "Notas",
    iconActive: "document-text",
    iconInactive: "document-text-outline",
  },
  {
    name: "checklists/index",
    title: "Tareas",
    iconActive: "checkbox",
    iconInactive: "checkbox-outline",
  },
  {
    name: "ideas/index",
    title: "Ideas",
    iconActive: "bulb",
    iconInactive: "bulb-outline",
  },
];

export default function TabsLayout() {
  const theme = useAppTheme();
  const isDarkMode = useIsDarkMode();
  const themeMode = useNoteStore((state) => state.themeMode);
  const toggleTheme = useNoteStore((state) => state.toggleTheme);
  const pathname = usePathname();

  const getType = () => {
    if (pathname.includes("notas")) return "note";
    if (pathname.includes("checklists")) return "checklist";
    if (pathname.includes("ideas")) return "idea";
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}> 
        <Text style={[styles.title, { color: theme.colors.text }]}>NoteFlow</Text>
        <Pressable style={[styles.themeToggle, { backgroundColor: theme.colors.surface }]} onPress={toggleTheme}>
          <Ionicons
            name={isDarkMode ? "moon" : "sunny"}
            size={20}
            color={theme.colors.text}
            style={styles.themeIcon}
          />
          <Text style={[styles.themeToggleText, { color: theme.colors.text }]}>{themeMode === "dark" ? "Oscuro" : themeMode === "light" ? "Claro" : "Auto"}</Text>
        </Pressable>
      </View>
      <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textMuted,
            tabBarStyle: {
              backgroundColor: theme.colors.surface,
              borderTopWidth: 0,
              height: 72,
              paddingTop: 10,
              shadowColor: theme.colors.text,
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 18,
              elevation: 12,
            },
            headerStyle: {
              backgroundColor: theme.colors.surface,
            },
        }}
      >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? tab.iconActive : tab.iconInactive}
                size={24}
                color={color}
              />
            ),
          }}
        />
      ))}
      <Tabs.Screen
        name="notas/[id]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="checklists/[id]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="ideas/[id]"
        options={{ href: null }}
      />

    </Tabs>
    <Pressable style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={() => router.push(`/new-note?type=${getType()}`)}>
      <Text style={styles.addButtonText}>+</Text>
    </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: color.neutral[50],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: color.neutral[100],
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  themeIcon: {
    marginRight: 8,
  },
  themeToggleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  addButton: {
    position: "absolute",
    bottom: 86,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 28,
    backgroundColor: color.primary[500],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: color.neutral[900],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  addButtonText: {
    color: color.neutral[0],
    fontSize: 30,
    lineHeight: 34,
    fontWeight: typography.fontWeight.bold,
  }
})