import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { color } from "@/constants/theme";
import { TabConfig } from "@/types";

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
  return (
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
  );
}