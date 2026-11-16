import { StyleSheet } from "react-native";

import { sizing, space, typography } from "@/theme";

export const styles = StyleSheet.create({
  group: { gap: space.sm },
  options: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  navigation: { flexDirection: "row", alignItems: "center", gap: space.sm },
  arrow: {
    minWidth: sizing.touch,
    minHeight: sizing.touch,
    alignItems: "center",
    justifyContent: "center",
  },
  count: { ...typography.caption },
});
