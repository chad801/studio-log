import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "../components/Buttons";
import { QuickAddModal } from "../components/QuickAddModal";
import { RecordCard } from "../components/RecordCard";
import { EntityType } from "../domain/models";
import { useStudio } from "../store/StudioStore";
import { colors, radius, spacing, typography } from "../ui/theme";
import { ScreenShell } from "./ScreenShell";

const extraTypes: Array<{ type: EntityType; title: string; summary: string }> = [
  { type: "inspiration", title: "Inspiration", summary: "Reference boards, links, notes, sketches, and future project conversion." },
  { type: "pricing", title: "Pricing", summary: "Material, labor, firing, overhead, wholesale, retail, margin, consignment." },
  { type: "socialAsset", title: "Social", summary: "Calendar, captions, hashtags, asset library, post status, export workflows." },
  { type: "customer", title: "Customers", summary: "Commission and collector records for future sales workflows." },
  { type: "sharedRecipe", title: "Sharing", summary: "Private export first. Public community requires moderation before launch." }
];

export function MoreScreen() {
  const { recordsByType, photosFor, exportBackup, importBackup } = useStudio();
  const [adding, setAdding] = useState<EntityType | null>(null);

  return (
    <ScreenShell title="Studio OS" eyebrow="Backups and next modules">
      <View style={styles.backupPanel}>
        <Text style={styles.panelTitle}>Backup</Text>
        <Text style={styles.panelBody}>Exports include structured records and local photo data. Import replaces local studio data.</Text>
        <View style={styles.backupActions}>
          <ActionButton label="Export" tone="primary" onPress={exportBackup} />
          <ActionButton label="Import" onPress={importBackup} />
        </View>
      </View>

      {extraTypes.map((item) => {
        const records = recordsByType(item.type);
        return (
          <View key={item.type} style={styles.module}>
            <View style={styles.moduleHeader}>
              <View style={styles.moduleTitleWrap}>
                <Text style={styles.moduleTitle}>{item.title}</Text>
                <Text style={styles.moduleSummary}>{item.summary}</Text>
              </View>
              {["inspiration", "socialAsset", "customer"].includes(item.type) && (
                <ActionButton label="Add" onPress={() => setAdding(item.type)} />
              )}
            </View>
            <View style={styles.records}>
              {records.length ? (
                records.slice(0, 3).map((record) => <RecordCard key={record.id} compact record={record} photos={photosFor(record.id)} />)
              ) : (
                <Text style={styles.empty}>No records yet.</Text>
              )}
            </View>
          </View>
        );
      })}

      <QuickAddModal visible={!!adding} type={adding ?? "inspiration"} title={adding ?? "Record"} onClose={() => setAdding(null)} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  backupPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  panelTitle: {
    ...typography.title,
    color: colors.ink
  },
  panelBody: {
    ...typography.body,
    color: colors.muted
  },
  backupActions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  module: {
    gap: spacing.md
  },
  moduleHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  moduleTitleWrap: {
    flex: 1
  },
  moduleTitle: {
    ...typography.title,
    color: colors.ink
  },
  moduleSummary: {
    ...typography.caption,
    color: colors.muted,
    marginTop: spacing.xs
  },
  records: {
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
  }
});
