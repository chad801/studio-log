import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ActionButton } from "../components/Buttons";
import { QuickAddModal } from "../components/QuickAddModal";
import { RecordCard } from "../components/RecordCard";
import { useStudio } from "../store/StudioStore";
import { colors, radius, spacing, typography } from "../ui/theme";
import { ScreenShell } from "./ScreenShell";

export function KilnScreen() {
  const { recordsByType, photosFor } = useStudio();
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const firings = recordsByType("firing").filter((record) => JSON.stringify(record).toLowerCase().includes(query.toLowerCase()));

  return (
    <ScreenShell title="Kiln" eyebrow="Schedules, logs, load photos" action={<ActionButton label="Add" tone="primary" onPress={() => setAdding(true)} />}>
      <TextInput
        accessibilityLabel="Search kiln logs"
        onChangeText={setQuery}
        placeholder="Search cone, kiln, atmosphere, maintenance"
        placeholderTextColor={colors.quiet}
        style={styles.search}
        value={query}
      />
      <View style={styles.list}>
        {firings.map((record) => (
          <View key={record.id} style={styles.firingBlock}>
            <RecordCard record={record} photos={photosFor(record.id)} />
            {!!record.rampHoldSteps?.length && (
              <View style={styles.steps}>
                {record.rampHoldSteps.map((step) => (
                  <Text key={step.id} style={styles.step}>
                    {step.order}. {step.ratePerHourF}F/hr to {step.targetTemperatureF}F, hold {step.holdMinutes}m
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
      <QuickAddModal visible={adding} type="firing" title="Firing log" onClose={() => setAdding(false)} />
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
  },
  firingBlock: {
    gap: spacing.sm
  },
  steps: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  step: {
    ...typography.caption,
    color: colors.muted
  }
});
