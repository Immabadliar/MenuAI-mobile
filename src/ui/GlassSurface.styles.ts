import { StyleSheet } from "react-native";

import { colors, glass, radius, sizing } from "@/theme";

export const styles = StyleSheet.create({
  backdrop: {
    pointerEvents: "none",
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
  },
  daylight: {
    position: "absolute",
    top: 0,
    left: 0,
    width: sizing.lightPaneWidth,
    height: sizing.lightPaneHeight,
    transform: [{ rotate: glass.lightAngle }],
  },
  veil: { backgroundColor: colors.veil },
  immersiveVeil: { backgroundColor: colors.immersiveVeil },
  fill: { pointerEvents: "none", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  shell: {
    overflow: "hidden",
    borderWidth: sizing.hairline,
    borderColor: colors.glassEdge,
    boxShadow: glass.shadow,
  },
  rounded: { borderRadius: radius.medium },
  pill: { borderRadius: radius.pill },
  material: { backgroundColor: colors.glass },
  solid: { backgroundColor: colors.glassStrong },
  native: { backgroundColor: colors.clear },
  primary: { backgroundColor: colors.accent, borderColor: colors.glassEdge },
});
