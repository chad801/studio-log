import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { PhotoAsset } from "../domain/models";
import { colors, radius, spacing, typography } from "../ui/theme";

interface PhotoRailProps {
  photos: PhotoAsset[];
  emptyLabel?: string;
}

export function PhotoRail({ photos, emptyLabel = "No photos yet" }: PhotoRailProps) {
  if (!photos.length) {
    return <Text style={styles.empty}>{emptyLabel}</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
      {photos.map((photo) => (
        <View key={photo.id} style={styles.photoFrame}>
          <Image source={{ uri: photo.uri }} style={styles.photo} />
          <Text numberOfLines={1} style={styles.role}>
            {photo.role.replace("_", " ")}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rail: {
    gap: spacing.sm,
    paddingRight: spacing.md
  },
  photoFrame: {
    width: 96
  },
  photo: {
    backgroundColor: colors.line,
    borderRadius: radius.sm,
    height: 96,
    width: 96
  },
  role: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 3,
    textTransform: "capitalize"
  },
  empty: {
    ...typography.caption,
    color: colors.quiet,
    marginTop: spacing.sm
  }
});
