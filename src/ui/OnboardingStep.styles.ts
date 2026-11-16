import { StyleSheet } from "react-native";

import { colors, radius, sizing, space, typography } from "@/theme";

export const onboardingStyles = StyleSheet.create({
  background: { flex: 1, backgroundColor: colors.clear },
  screen: {
    flex: 1,
    width: "100%",
    maxWidth: sizing.authContent,
    alignSelf: "center",
    paddingHorizontal: space.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: space.sm,
  },
  backButton: { minWidth: sizing.touch, minHeight: sizing.touch, justifyContent: "center" },

  brand: { ...typography.section, color: colors.ink },
  progress: { ...typography.caption, minWidth: sizing.touch, textAlign: "right" },
  title: { ...typography.displaySmall, marginVertical: space.sm },
  body: {
    flex: 1,
    minHeight: 0,
    justifyContent: "flex-start",
    gap: space.md,
    padding: space.lg,
  },
  footer: { gap: space.sm, paddingVertical: space.sm },

  caption: { ...typography.caption },
  error: { ...typography.caption, color: colors.danger },

  chipText: { ...typography.caption, color: colors.ink },

  input: {
    minHeight: sizing.input,
    borderRadius: radius.medium,
    borderWidth: sizing.hairline,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    ...typography.body,
    padding: space.lg,
  },
  multiline: {
    flex: 1,
    maxHeight: sizing.cameraHeight,
    minHeight: sizing.thumbnail,
    textAlignVertical: "top",
    backgroundColor: colors.clear,
    borderWidth: 0,
    borderBottomWidth: sizing.hairline,
    borderRadius: 0,
    paddingHorizontal: 0,
  },
});
