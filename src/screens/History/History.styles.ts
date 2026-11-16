import { StyleSheet } from "react-native";

import { colors, radius, sizing, space } from "@/theme";

export const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.lg },
  thumbnail: {
    width: sizing.historyThumbnail,
    height: sizing.historyThumbnail,
    borderRadius: radius.small,
  },
  placeholder: {
    width: sizing.historyThumbnail,
    height: sizing.historyThumbnail,
    borderRadius: radius.small,
    backgroundColor: colors.grayLight,
    alignItems: "center",
    justifyContent: "center",
  },
  details: { flex: 1, gap: space.sm },
});
