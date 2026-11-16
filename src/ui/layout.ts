import { StyleSheet } from "react-native";

import { colors, radius, space } from "@/theme";

export const layout = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: space.sm },
  stack: { gap: space.lg },
  warning: {
    backgroundColor: colors.warningBackground,
    borderRadius: radius.medium,
    padding: space.lg,
    borderBottomWidth: 0,
  },
});
