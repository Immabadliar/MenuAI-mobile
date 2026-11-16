import { StyleSheet } from "react-native";

import { colors, radius, sizing, space } from "@/theme";

export function createProgressStyles(step: number, total: number) {
  return StyleSheet.create({
    track: {
      height: sizing.fitBar,
      backgroundColor: colors.hairline,
      borderRadius: radius.pill,
      marginBottom: space.lg,
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      width: `${Math.min(100, (step / total) * 100)}%`,
      backgroundColor: colors.accent,
    },
  });
}
