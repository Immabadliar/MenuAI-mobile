import { StyleSheet } from "react-native";

import { colors, space, typography } from "@/theme";

export const styles = StyleSheet.create({
  script: { ...typography.displaySmall, color: colors.ink, paddingVertical: space.xxl },
});
