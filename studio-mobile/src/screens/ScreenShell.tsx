import React, { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../ui/theme";

interface ScreenShellProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
}

export function ScreenShell({ title, eyebrow, action, children }: ScreenShellProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.heading}>
          {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
          <Text style={styles.title}>{title}</Text>
        </View>
        {action}
      </View>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.lg,
    justifyContent: "space-between"
  },
  heading: {
    flex: 1
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.teal
  },
  title: {
    ...typography.screenTitle,
    color: colors.ink
  }
});
