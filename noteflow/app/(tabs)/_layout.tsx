import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, StyleSheet, useColorScheme, View } from "react-native";
import { color } from "@/constants/theme";
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
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const pathname = usePathname();

  const getType = () => {
    if (pathname.includes("notas")) return "note";
    if (pathname.includes("checklists")) return "checklist";
    if (pathname.includes("ideas")) return "idea";
  };

  return (
    <View style={{ flex:1 }}>
    <Tabs
      screenOptions={{
          tabBarActiveTintColor: color.primary[500],
          tabBarInactiveTintColor: color.neutral[400],
          tabBarStyle: {
            backgroundColor: isDarkMode ? color.neutral[900] : color.neutral[50],
          },
          headerStyle: {
            backgroundColor: isDarkMode ? color.neutral[900] : color.neutral[50],
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
    <Pressable style={styles.addButton} onPress={() => router.push(`/new-note?type=${getType()}`)}>
    <Text style={styles.addButtonText}>+</Text>
    </Pressable>
    </View>
  );
}

const styles = StyleSheet.create ({
  addButton: {
    position: "absolute",
    bottom: 80,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: color.primary[500],
    justifyContent: "center",
    alignItems: "center",
    elevation:4,
  },
  addButtonText: {
    color: color.neutral[0],
    fontSize: 28,
    lineHeight: 30,
  }
})