import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ActionButton } from "../components/Buttons";
import { QuickAddModal } from "../components/QuickAddModal";
import { RecordCard } from "../components/RecordCard";
import { useStudio } from "../store/StudioStore";
import { colors, radius, spacing } from "../ui/theme";
import { ScreenShell } from "./ScreenShell";

export function ProjectsScreen() {
  const { recordsByType, photosFor } = useStudio();
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const projects = recordsByType("project").filter((record) => JSON.stringify(record).toLowerCase().includes(query.toLowerCase()));

  return (
    <ScreenShell title="Projects" eyebrow="Idea to finished piece" action={<ActionButton label="Add" tone="primary" onPress={() => setAdding(true)} />}>
      <TextInput
        accessibilityLabel="Search projects"
        onChangeText={setQuery}
        placeholder="Search stage, clay, tasks, notes"
        placeholderTextColor={colors.quiet}
        style={styles.search}
        value={query}
      />
      <View style={styles.list}>
        {projects.map((record) => (
          <RecordCard key={record.id} record={record} photos={photosFor(record.id)} />
        ))}
      </View>
      <QuickAddModal visible={adding} type="project" title="Project" onClose={() => setAdding(false)} />
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
