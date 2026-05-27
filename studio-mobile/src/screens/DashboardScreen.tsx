import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { EntityType } from "../domain/models";
import { useStudio } from "../store/StudioStore";
import { colors, radius, spacing, typography } from "../ui/theme";
import { RecordCard } from "../components/RecordCard";
import { PhotoRail } from "../components/PhotoRail";
import { ScreenShell } from "./ScreenShell";

interface DashboardScreenProps {
  onOpenTab: (tab: "inventory" | "recipes" | "projects" | "kiln" | "gallery" | "more") => void;
}

export function DashboardScreen({ onOpenTab }: DashboardScreenProps) {
  const { records, photos, recordsByType, photosFor } = useStudio();
  const inventory = recordsByType("inventory");
  const lowInventory = inventory.filter((item) => {
    if (item.quantityOnHand === undefined || item.reorderPoint === undefined) return false;
    return item.quantityOnHand <= item.reorderPoint;
  });
  const activeProjects = recordsByType("project").filter((project) => project.projectStage !== "sold").slice(0, 3);
  const firings = recordsByType("firing").slice(0, 2);
  const recentPhotos = photos.slice(0, 8);

  return (
    <ScreenShell title="Today in studio" eyebrow="Dashboard">
      <View style={styles.statsGrid}>
        <Stat label="Inventory" value={inventory.length} onPress={() => onOpenTab("inventory")} />
        <Stat label="Recipes" value={recordsByType("recipe").length} onPress={() => onOpenTab("recipes")} />
        <Stat label="Projects" value={recordsByType("project").length} onPress={() => onOpenTab("projects")} />
        <Stat label="Pieces" value={recordsByType("piece").length} onPress={() => onOpenTab("gallery")} />
      </View>

      <Panel title="Needs attention" actionLabel="Inventory" onAction={() => onOpenTab("inventory")}>
        {lowInventory.length ? (
          lowInventory.slice(0, 3).map((record) => <RecordCard key={record.id} compact record={record} photos={photosFor(record.id)} />)
        ) : (
          <Text style={styles.empty}>No low inventory based on current reorder points.</Text>
        )}
      </Panel>

      <Panel title="Active projects" actionLabel="Projects" onAction={() => onOpenTab("projects")}>
        {activeProjects.length ? (
          activeProjects.map((record) => <RecordCard key={record.id} compact record={record} photos={photosFor(record.id)} />)
        ) : (
          <Text style={styles.empty}>No active projects yet.</Text>
        )}
      </Panel>

      <Panel title="Upcoming kiln work" actionLabel="Kiln" onAction={() => onOpenTab("kiln")}>
        {firings.length ? (
          firings.map((record) => <RecordCard key={record.id} compact record={record} photos={photosFor(record.id)} />)
        ) : (
          <Text style={styles.empty}>No firing logs planned.</Text>
        )}
      </Panel>

      <Panel title="Recent photos" actionLabel="Gallery" onAction={() => onOpenTab("gallery")}>
        <PhotoRail photos={recentPhotos} emptyLabel="Add photos from recipes, projects, firings, or pieces." />
      </Panel>

      <Text style={styles.modelNote}>
        Local model coverage: {Array.from(new Set(records.map((record) => record.type as EntityType))).join(", ")}.
      </Text>
    </ScreenShell>
  );
}

function Stat({ label, value, onPress }: { label: string; value: number; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </Pressable>
  );
}

function Panel({ title, actionLabel, onAction, children }: React.PropsWithChildren<{ title: string; actionLabel: string; onAction: () => void }>) {
  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>{title}</Text>
        <Pressable accessibilityRole="button" onPress={onAction} style={styles.panelAction}>
          <Text style={styles.panelActionText}>{actionLabel}</Text>
        </Pressable>
      </View>
      <View style={styles.panelBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  stat: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    minHeight: 96,
    padding: spacing.md
  },
  statLabel: {
    ...typography.badge,
    color: colors.muted
  },
  statValue: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "900",
    marginTop: spacing.sm
  },
  panel: {
    gap: spacing.md
  },
  panelHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  panelTitle: {
    ...typography.title,
    color: colors.ink
  },
  panelAction: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.sm,
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  panelActionText: {
    ...typography.badge,
    color: colors.tealDeep
  },
  panelBody: {
    gap: spacing.sm
  },
  empty: {
    ...typography.body,
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.muted,
    padding: spacing.lg
  },
  modelNote: {
    ...typography.caption,
    color: colors.quiet
  }
});
