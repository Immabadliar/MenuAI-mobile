import { Tabs } from "expo-router";

import { GlassTabBar } from "./GlassTabBar";
import { tabStyles } from "./navigation.styles";

export default function TabNavigator() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: tabStyles.scene }}
    >
      <Tabs.Screen name="scan" options={{ title: "Scan" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
