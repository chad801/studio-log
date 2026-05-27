import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { RecordCard } from "../components/RecordCard";
import { QuickAddModal } from "../components/QuickAddModal";
import { ActionButton } from "../components/Buttons";
import { useStudio } from "../store/StudioStore";
import { colors, radius, spacing } from "../ui/theme";
import { ScreenShell } from "./ScreenShell";

export function InventoryScreen() {
  const { recordsByType, photosFor } = useStudio();
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const records = recordsByType("inventory").filter((record) => JSON.stringify(record).toLowerCase().includes(query.toLowerCase()));

  return (
    <ScreenShell title="Inventory" eyebrow="Materials, tools, vendors" action={<ActionButton label="Add" tone="primary" onPress={() => setAdding(true)} />}>
      <TextInput
        accessibilityLabel="Search inventory"
        onChangeText={setQuery}
        placeholder="Search clay, chemicals, tools, locations"
        placeholderTextColor={colors.quiet}
        style={styles.search}
        value={query}
      />
      <View style={styles.list}>
        {records.map((record) => (
          <RecordCard key={record.id} record={record} photos={photosFor(record.id)} />
        ))}
      </View>
      <QuickAddModal visible={adding} type="inventory" title="Inventory item" onClose={() => setAdding(false)} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md
  },
  list: {
    gap: spacing.md
  }
});
