import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ActionButton } from "../components/Buttons";
import { QuickAddModal } from "../components/QuickAddModal";
import { RecordCard } from "../components/RecordCard";
import { useStudio } from "../store/StudioStore";
import { colors, radius, spacing } from "../ui/theme";
import { ScreenShell } from "./ScreenShell";

export function GalleryScreen() {
  const { recordsByType, photosFor } = useStudio();
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const pieces = recordsByType("piece").filter((record) => JSON.stringify(record).toLowerCase().includes(query.toLowerCase()));

  return (
    <ScreenShell title="Gallery" eyebrow="Bisque, finished, sold" action={<ActionButton label="Add" tone="primary" onPress={() => setAdding(true)} />}>
      <TextInput
        accessibilityLabel="Search gallery"
        onChangeText={setQuery}
        placeholder="Search collection, price, sale status, tags"
        placeholderTextColor={colors.quiet}
        style={styles.search}
        value={query}
      />
      <View style={styles.list}>
        {pieces.map((record) => (
          <RecordCard key={record.id} record={record} photos={photosFor(record.id)} />
        ))}
      </View>
      <QuickAddModal visible={adding} type="piece" title="Finished or bisque piece" onClose={() => setAdding(false)} />
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
