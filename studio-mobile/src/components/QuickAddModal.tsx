import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { EntityType, StudioRecord } from "../domain/models";
import { useStudio } from "../store/StudioStore";
import { colors, radius, spacing, typography } from "../ui/theme";
import { ActionButton } from "./Buttons";

interface FieldConfig {
  key: keyof StudioRecord;
  label: string;
  keyboard?: "default" | "decimal-pad" | "number-pad" | "email-address";
  multiline?: boolean;
}

const fieldsByType: Partial<Record<EntityType, FieldConfig[]>> = {
  inventory: [
    { key: "title", label: "Item name" },
    { key: "quantityOnHand", label: "Quantity", keyboard: "decimal-pad" },
    { key: "unit", label: "Unit" },
    { key: "reorderPoint", label: "Reorder point", keyboard: "decimal-pad" },
    { key: "vendorName", label: "Vendor" },
    { key: "storageLocation", label: "Storage location" },
    { key: "lotNumber", label: "Lot number" },
    { key: "sdsNotes", label: "SDS / safety notes", multiline: true },
    { key: "notes", label: "Notes", multiline: true }
  ],
  recipe: [
    { key: "title", label: "Recipe name" },
    { key: "recipeKind", label: "Recipe type" },
    { key: "cone", label: "Cone" },
    { key: "atmosphere", label: "Atmosphere" },
    { key: "batchSize", label: "Batch size", keyboard: "decimal-pad" },
    { key: "batchUnit", label: "Batch unit" },
    { key: "clayBody", label: "Clay body" },
    { key: "notes", label: "Formula / notes", multiline: true }
  ],
  project: [
    { key: "title", label: "Project name" },
    { key: "projectStage", label: "Stage" },
    { key: "clayBody", label: "Clay body" },
    { key: "dimensions", label: "Dimensions" },
    { key: "notes", label: "Notes", multiline: true }
  ],
  firing: [
    { key: "title", label: "Firing name" },
    { key: "kilnName", label: "Kiln" },
    { key: "firingStatus", label: "Status" },
    { key: "cone", label: "Cone" },
    { key: "atmosphere", label: "Atmosphere" },
    { key: "startAt", label: "Start date/time" },
    { key: "notes", label: "Notes", multiline: true }
  ],
  piece: [
    { key: "title", label: "Piece name" },
    { key: "collectionName", label: "Collection" },
    { key: "dimensions", label: "Dimensions" },
    { key: "priceCents", label: "Retail price in cents", keyboard: "number-pad" },
    { key: "saleStatus", label: "Sale status" },
    { key: "notes", label: "Notes", multiline: true }
  ],
  inspiration: [
    { key: "title", label: "Inspiration title" },
    { key: "source", label: "Source" },
    { key: "sourceUrl", label: "Link" },
    { key: "notes", label: "Notes", multiline: true }
  ],
  socialAsset: [
    { key: "title", label: "Content idea" },
    { key: "captionDraft", label: "Caption draft", multiline: true },
    { key: "notes", label: "Post notes", multiline: true }
  ],
  customer: [
    { key: "title", label: "Customer name" },
    { key: "email", label: "Email", keyboard: "email-address" },
    { key: "phone", label: "Phone" },
    { key: "notes", label: "Notes", multiline: true }
  ]
};

interface QuickAddModalProps {
  visible: boolean;
  type: EntityType;
  title: string;
  onClose: () => void;
}

export function QuickAddModal({ visible, type, title, onClose }: QuickAddModalProps) {
  const { createStudioRecord } = useStudio();
  const fields = useMemo(() => fieldsByType[type] ?? fieldsByType.inspiration ?? [], [type]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const input: Partial<StudioRecord> = {};
    for (const field of fields) {
      const value = form[String(field.key)]?.trim();
      if (!value) continue;
      if (["quantityOnHand", "reorderPoint", "batchSize", "priceCents"].includes(String(field.key))) {
        (input as Record<string, unknown>)[String(field.key)] = Number(value);
      } else {
        (input as Record<string, unknown>)[String(field.key)] = value;
      }
    }
    await createStudioRecord(type, input);
    setForm({});
    setSaving(false);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modal}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Add record</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          <ActionButton label="Close" onPress={onClose} />
        </View>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          {fields.map((field) => {
            const key = String(field.key);
            return (
              <View key={key} style={styles.field}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  accessibilityLabel={field.label}
                  keyboardType={field.keyboard ?? "default"}
                  multiline={field.multiline}
                  onChangeText={(value) => setForm((current) => ({ ...current, [key]: value }))}
                  placeholder={field.label}
                  placeholderTextColor={colors.quiet}
                  style={[styles.input, field.multiline && styles.textArea]}
                  value={form[key] ?? ""}
                />
              </View>
            );
          })}
          <ActionButton label={saving ? "Saving" : "Save"} onPress={save} tone="primary" />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.canvas,
    flex: 1
  },
  header: {
    alignItems: "center",
    borderBottomColor: colors.line,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.lg
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.teal
  },
  title: {
    ...typography.title,
    color: colors.ink
  },
  form: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },
  field: {
    gap: spacing.sm
  },
  label: {
    ...typography.badge,
    color: colors.muted
  },
  input: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top"
  }
});
