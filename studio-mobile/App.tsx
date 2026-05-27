import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StudioProvider, useStudio } from "./src/store/StudioStore";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { InventoryScreen } from "./src/screens/InventoryScreen";
import { RecipesScreen } from "./src/screens/RecipesScreen";
import { ProjectsScreen } from "./src/screens/ProjectsScreen";
import { KilnScreen } from "./src/screens/KilnScreen";
import { GalleryScreen } from "./src/screens/GalleryScreen";
import { MoreScreen } from "./src/screens/MoreScreen";
import { colors, radius, spacing, typography } from "./src/ui/theme";

type TabKey = "dashboard" | "inventory" | "recipes" | "projects" | "kiln" | "gallery" | "more";

const tabs: Array<{ key: TabKey; label: string; short: string }> = [
  { key: "dashboard", label: "Today", short: "TD" },
  { key: "inventory", label: "Inventory", short: "IN" },
  { key: "recipes", label: "Recipes", short: "RC" },
  { key: "projects", label: "Projects", short: "PR" },
  { key: "kiln", label: "Kiln", short: "KL" },
  { key: "gallery", label: "Gallery", short: "GA" },
  { key: "more", label: "More", short: "MO" }
];

function StudioApp() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const { ready, error } = useStudio();

  const screen = useMemo(() => {
    switch (activeTab) {
      case "inventory":
        return <InventoryScreen />;
      case "recipes":
        return <RecipesScreen />;
      case "projects":
        return <ProjectsScreen />;
      case "kiln":
        return <KilnScreen />;
      case "gallery":
        return <GalleryScreen />;
      case "more":
        return <MoreScreen />;
      case "dashboard":
      default:
        return <DashboardScreen onOpenTab={setActiveTab} />;
    }
  }, [activeTab]);

  if (!ready) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.teal} />
        <Text style={styles.loadingText}>Opening studio data</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorTitle}>Storage error</Text>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.shell} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Pottery studio</Text>
          <Text style={styles.title}>Studio Log</Text>
        </View>
        <View style={styles.syncBadge}>
          <Text style={styles.syncText}>Offline</Text>
        </View>
      </View>
      <View style={styles.content}>{screen}</View>
      <SafeAreaView edges={["bottom"]} style={styles.tabSafeArea}>
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tabButton, selected && styles.tabButtonActive]}
              >
                <Text style={[styles.tabShort, selected && styles.tabTextActive]}>{tab.short}</Text>
                <Text numberOfLines={1} style={[styles.tabLabel, selected && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StudioProvider>
        <StudioApp />
      </StudioProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.canvas
  },
  header: {
    alignItems: "center",
    borderBottomColor: colors.line,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.teal
  },
  title: {
    ...typography.screenTitle,
    color: colors.ink
  },
  syncBadge: {
    backgroundColor: colors.sageSoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  syncText: {
    ...typography.badge,
    color: colors.sageDeep
  },
  content: {
    flex: 1
  },
  tabSafeArea: {
    backgroundColor: colors.panel
  },
  tabBar: {
    borderTopColor: colors.line,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 2,
    paddingHorizontal: 6,
    paddingTop: 6
  },
  tabButton: {
    alignItems: "center",
    borderRadius: radius.sm,
    flex: 1,
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: 2
  },
  tabButtonActive: {
    backgroundColor: colors.tealSoft
  },
  tabShort: {
    ...typography.badge,
    color: colors.muted
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2
  },
  tabTextActive: {
    color: colors.tealDeep
  },
  centered: {
    alignItems: "center",
    backgroundColor: colors.canvas,
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl
  },
  loadingText: {
    color: colors.muted,
    fontSize: 16,
    marginTop: spacing.md
  },
  errorTitle: {
    color: colors.danger,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: spacing.sm
  },
  errorText: {
    color: colors.muted,
    fontSize: 16,
    textAlign: "center"
  }
});
