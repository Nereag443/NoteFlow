import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, StyleSheet, View, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme, useIsDarkMode, color, typography } from "@/constants/theme";
import { useNoteStore } from "@/store/notesStore";
import { TabConfig } from "@/types";
import { router, usePathname } from "expo-router";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { useState, useEffect } from "react";

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
  {
    name: "stats/index",
    title: "Stats",
    iconActive: "stats-chart",
    iconInactive: "stats-chart-outline",
  }
];

export default function TabsLayout() {
  const theme = useAppTheme();
  const isDarkMode = useIsDarkMode();
  const themeMode = useNoteStore((state) => state.themeMode);
  const toggleTheme = useNoteStore((state) => state.toggleTheme);
  const pathname = usePathname();
  const avatarUrl = useNoteStore((state) => state.avatarUrl);
  const setStoreAvatarUrl = useNoteStore((state) => state.setAvatarUrl);

  useEffect(() => {
    if(Platform.OS === "web"){
      return;
    }
    const loadAvatar = async () => {
      const user = getAuth().currentUser;
      if(!user) return;
      const db = getFirestore();
      const doSnap = await getDoc(doc(db, "users", user.uid));
      if(doSnap.exists()){
        setStoreAvatarUrl(doSnap.data().avatarUrl ?? undefined);
      }
    };
    loadAvatar();
  }, [])

  const getType = () => {
    if (pathname.includes("notas")) return "note";
    if (pathname.includes("checklists")) return "checklist";
    if (pathname.includes("ideas")) return "idea";
    return "note";
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
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.surfaceVariant, shadowColor: theme.colors.elevation }]}>
        <View>
          <Text style={[styles.title, { color: theme.colors.text }]}>NoteFlow</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable 
            onPress={() => router.push("/archived")} 
            style={{ padding: 8, borderRadius: 8, backgroundColor: theme.colors.surfaceVariant }}>
            <Ionicons name="archive-outline" size={20} color={theme.colors.text} />
          </Pressable>
          <Pressable style={styles.avatar} onPress={() => router.push("/profile")}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="person" size={20} color={color.neutral[0]} />
              </View>
            )}
          </Pressable>
        </View>
      </View>
      <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textMuted,
            tabBarStyle: {
              backgroundColor: theme.colors.surfaceVariant,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
              height: 72,
              paddingTop: 10,
              shadowColor: theme.colors.elevation,
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.12,
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
    paddingVertical: 20,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: color.neutral[100],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
  },
  avatar: {
    alignItems: "center",
    width: 38,
    height: 38,
    justifyContent: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 100,
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
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  archiveButton: {
    padding: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 999,
  }
})