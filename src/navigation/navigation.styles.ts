import { StyleSheet } from "react-native";

import { colors, motion, radius, sizing, space, typography } from "@/theme";

export const tabStyles = StyleSheet.create({
  dock: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: space.xl,
    pointerEvents: "box-none",
  },
  bar: {
    flexDirection: "row",
    width: "100%",
    maxWidth: sizing.authContent,
    padding: space.sm,
    gap: space.xs,
  },
  item: {
    flex: 1,
    minWidth: 0,
    minHeight: sizing.input,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
  },
  selectedItem: { backgroundColor: colors.selectedBackground },
  label: { ...typography.caption },
  selectedLabel: { color: colors.accent },
  pressed: { opacity: motion.pressedOpacity, transform: [{ scale: motion.pressedScale }] },
  scene: { backgroundColor: colors.clear },
});

export function createDockStyles(bottomInset: number) {
  return StyleSheet.create({ position: { bottom: Math.max(space.lg, bottomInset) } });
}
