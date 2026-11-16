import { Stack } from "expo-router";

import { styles } from "@/ui/GlassSurface.styles";

export const unstable_settings = { initialRouteName: "diet" };
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: styles.native }} />;
}
