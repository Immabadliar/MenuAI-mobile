import { colors } from "./colors";

export { colors } from "./colors";
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };
export const radius = { small: 20, medium: 28, pill: 999 };
export const fonts = {
  display: "DMSans_500Medium",
  body: "DMSans_400Regular",
  medium: "DMSans_500Medium",
};
export const typography = {
  title: { fontFamily: fonts.display, fontSize: 34, lineHeight: 44, color: colors.ink },
  displaySmall: { fontFamily: fonts.display, fontSize: 28, lineHeight: 36, color: colors.ink },
  heading: { fontFamily: fonts.medium, fontSize: 20, lineHeight: 28, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 21, color: colors.ink },
  label: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 21, color: colors.ink },
  caption: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.muted },
  section: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.6,
    textTransform: "uppercase" as const,
    color: colors.muted,
  },
};
export const sizing = {
  lightPaneWidth: 240,
  lightPaneHeight: 1200,
  lightTravel: 120,
  tabInset: 120,
  tabHeight: 80,
  dietChoicesPerPage: 4,
  compactDietChoices: 2,
  compactHeight: 700,
  largeTextScale: 1.3,
  button: 48,
  input: 56,
  touch: 44,
  icon: 22,
  smallIcon: 20,
  content: 600,
  authContent: 480,
  imageLongEdge: 1500,
  thumbnail: 80,
  historyThumbnail: 64,
  cameraHeight: 240,
  textArea: 160,
  googleLogo: 20,
  hairline: 1,
  fitBar: 4,
};
export const motion = {
  pressedScale: 0.98,
  pressedOpacity: 0.85,
  disabledOpacity: 0.5,
  skeletonOpacity: 0.4,
  duration: 280,
  pulse: 850,
  stagger: 40,
  enterDistance: 16,
  shutter: 120,
  ambient: 18000,
};
export const disclaimer =
  "Suggestions only. Menus and AI can be wrong; confirm allergies with your server.";

export { glass } from "./glass";
