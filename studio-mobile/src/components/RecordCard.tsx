import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { PhotoAsset, StudioRecord, formatCents } from "../domain/models";
import { useStudio } from "../store/StudioStore";
import { colors, radius, spacing, typography } from "../ui/theme";
import { ActionButton } from "./Buttons";
import { PhotoRail } from "./PhotoRail";

interface RecordCardProps {
  record: StudioRecord;
  photos: PhotoAsset[];
  compact?: boolean;
}

export function RecordCard({ record, photos, compact }: RecordCardProps) {
  const { addPhotoFromCamera, addPhotoFromLibrary } = useStudio();
  const meta = buildMeta(record);
  const role = photoRoleFor(record);

  function choosePhotoSource() {
    Alert.alert("Add photo", record.title, [
      { text: "Camera", onPress: () => addPhotoFromCamera(record, role) },
      { text: "Library", onPress: () => addPhotoFromLibrary(record, role) },
      { text: "Cancel", style: "cancel" }
    ]);
  }

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.type}>{record.type}</Text>
          <Text style={styles.title}>{record.title}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={choosePhotoSource} style={styles.photoButton}>
          <Text style={styles.photoButtonText}>PH</Text>
        </Pressable>
      </View>
      {meta.length > 0 && (
        <View style={styles.metaRow}>
          {meta.map((item) => (
            <Text key={item} style={styles.metaPill}>
              {item}
            </Text>
          ))}
        </View>
      )}
      {!!record.notes && <Text style={styles.notes}>{record.notes}</Text>}
      {!compact && <PhotoRail photos={photos} />}
      {!compact && (
        <View style={styles.actions}>
          <ActionButton label="Camera" onPress={() => addPhotoFromCamera(record, role)} />
          <ActionButton label="Library" onPress={() => addPhotoFromLibrary(record, role)} />
        </View>
      )}
    </View>
  );
}

function buildMeta(record: StudioRecord): string[] {
  switch (record.type) {
    case "inventory":
      return [
        record.inventoryKind?.replace("_", " ") ?? "",
        record.quantityOnHand !== undefined ? `${record.quantityOnHand} ${record.unit ?? ""}` : "",
        record.reorderPoint !== undefined ? `reorder ${record.reorderPoint}` : "",
        record.storageLocation ?? ""
      ].filter(Boolean);
    case "recipe":
      return [
        record.recipeKind ?? "",
        record.cone ? `cone ${record.cone}` : "",
        record.atmosphere ?? "",
        record.batchSize ? `${record.batchSize}${record.batchUnit ?? ""}` : ""
      ].filter(Boolean);
    case "firing":
      return [record.kilnName ?? "", record.firingStatus ?? "", record.cone ? `cone ${record.cone}` : "", record.atmosphere ?? ""].filter(Boolean);
    case "project":
      return [record.projectStage?.replace("_", " ") ?? "", record.clayBody ?? "", record.dimensions ?? ""].filter(Boolean);
    case "piece":
      return [record.collectionName ?? "", record.saleStatus?.replace("_", " ") ?? "", record.priceCents ? formatCents(record.priceCents) : ""].filter(Boolean);
    default:
      return [record.source ?? "", record.marketplace ?? ""].filter(Boolean);
  }
}

function photoRoleFor(record: StudioRecord): PhotoAsset["role"] {
  if (record.type === "recipe" || record.type === "glazeTest") return "test_tile";
  if (record.type === "firing") return "kiln_load";
  if (record.type === "piece") return "final";
  if (record.type === "inspiration") return "reference";
  return "process";
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  compact: {
    gap: spacing.sm,
    padding: spacing.md
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  titleWrap: {
    flex: 1
  },
  type: {
    ...typography.eyebrow,
    color: colors.teal
  },
  title: {
    ...typography.cardTitle,
    color: colors.ink,
    marginTop: 2
  },
  photoButton: {
    alignItems: "center",
    backgroundColor: colors.tealSoft,
    borderRadius: radius.sm,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  photoButtonText: {
    ...typography.badge,
    color: colors.tealDeep
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  metaPill: {
    ...typography.caption,
    backgroundColor: colors.sageSoft,
    borderRadius: 999,
    color: colors.sageDeep,
    overflow: "hidden",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    textTransform: "capitalize"
  },
  notes: {
    ...typography.body,
    color: colors.muted
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm
  }
});
