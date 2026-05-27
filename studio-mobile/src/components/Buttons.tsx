import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "../ui/theme";

interface ButtonProps {
  label: string;
  onPress: () => void;
  tone?: "primary" | "secondary" | "danger";
  style?: ViewStyle;
}

export function ActionButton({ label, onPress, tone = "secondary", style }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === "primary" && styles.primary,
        tone === "danger" && styles.danger,
        pressed && styles.pressed,
        style
      ]}
    >
      <Text style={[styles.label, tone === "primary" && styles.primaryLabel, tone === "danger" && styles.dangerLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  primary: {
    backgroundColor: colors.teal,
    borderColor: colors.teal
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerSoft
  },
  pressed: {
    opacity: 0.74
  },
  label: {
    ...typography.badge,
    color: colors.ink
  },
  primaryLabel: {
    color: colors.panel
  },
  dangerLabel: {
    color: colors.danger
  }
});
