import { StyleSheet } from "react-native";

import { colors, radius, sizing, space, typography } from "@/theme";

export const styles = StyleSheet.create({
  tabs: { gap: space.sm, paddingVertical: space.sm },
  pick: {
    backgroundColor: colors.glass,
    borderRadius: radius.medium,
    padding: space.xl,
    gap: space.lg,
    boxShadow: [{ offsetX: 0, offsetY: space.xs, blurRadius: space.xxl, color: colors.shadow }],
  },
  dish: { ...typography.displaySmall },
  why: { ...typography.body, color: colors.muted },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: space.sm,
  },
  score: { ...typography.caption },
  bar: {
    height: sizing.fitBar,
    borderRadius: radius.pill,
    backgroundColor: colors.hairline,
    overflow: "hidden",
  },
  warning: {
    backgroundColor: colors.warningBackground,
    borderRadius: radius.medium,
    padding: space.lg,
    gap: space.sm,
  },
  warningHeading: { flexDirection: "row", alignItems: "center", gap: space.sm },
  warningText: { ...typography.body, color: colors.warningText },
  warningNote: { ...typography.caption, color: colors.warningText },
  avoid: {
    gap: space.sm,
    paddingVertical: space.lg,
    borderBottomWidth: sizing.hairline,
    borderBottomColor: colors.hairline,
  },
});
export function createFitStyles(fit: number) {
  const value = Math.max(0, Math.min(100, fit));
  return StyleSheet.create({
    fill: {
      height: "100%",
      width: `${value}%`,
      backgroundColor: value >= 85 ? colors.olive : value >= 65 ? colors.amber : colors.stone,
    },
  });
}
