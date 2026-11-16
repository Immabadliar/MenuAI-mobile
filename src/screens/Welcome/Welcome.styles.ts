import { StyleSheet } from "react-native";

import { colors, space, typography } from "@/theme";

export const styles = StyleSheet.create({
  brand: { ...typography.section, color: colors.ink },
  hero: { flex: 1, minHeight: 0, justifyContent: "center", gap: space.xl },
  headline: { ...typography.title },
  subtitle: { ...typography.body, color: colors.muted },
  footer: { gap: space.lg, padding: space.lg },
  legal: { ...typography.caption, textAlign: "center" },
});
