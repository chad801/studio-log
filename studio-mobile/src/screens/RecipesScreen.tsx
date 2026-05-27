import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ActionButton } from "../components/Buttons";
import { QuickAddModal } from "../components/QuickAddModal";
import { RecordCard } from "../components/RecordCard";
import { useStudio } from "../store/StudioStore";
import { colors, radius, spacing, typography } from "../ui/theme";
import { ScreenShell } from "./ScreenShell";

export function RecipesScreen() {
  const { recordsByType, photosFor } = useStudio();
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const recipes = recordsByType("recipe").filter((record) => JSON.stringify(record).toLowerCase().includes(query.toLowerCase()));

  return (
    <ScreenShell title="Recipes" eyebrow="Glazes, slips, clay bodies" action={<ActionButton label="Add" tone="primary" onPress={() => setAdding(true)} />}>
      <TextInput
        accessibilityLabel="Search recipes"
        onChangeText={setQuery}
        placeholder="Search cone, atmosphere, clay body, defects"
        placeholderTextColor={colors.quiet}
        style={styles.search}
        value={query}
      />
      <View style={styles.list}>
        {recipes.map((record) => (
          <View key={record.id} style={styles.recipeBlock}>
            <RecordCard record={record} photos={photosFor(record.id)} />
            {!!record.ingredients?.length && (
              <View style={styles.ingredients}>
                {record.ingredients.slice(0, 6).map((ingredient) => (
                  <Text key={ingredient.id} style={styles.ingredient}>
                    {ingredient.materialName} {ingredient.percentage ?? ingredient.amount ?? ""}{ingredient.unit ?? ""}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
      <QuickAddModal visible={adding} type="recipe" title="Recipe" onClose={() => setAdding(false)} />
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
  recipeBlock: {
    gap: spacing.sm
  },
  ingredients: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  ingredient: {
    ...typography.caption,
    backgroundColor: colors.claySoft,
    borderRadius: 999,
    color: colors.clay,
    overflow: "hidden",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4
  }
});
