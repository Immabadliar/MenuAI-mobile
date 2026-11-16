import { Stack } from "expo-router";

import { styles } from "@/ui/GlassSurface.styles";

export const unstable_settings = { initialRouteName: "welcome" };
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: styles.native }} />;
}
