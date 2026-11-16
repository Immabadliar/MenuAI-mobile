import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { colors, sizing } from "@/theme";
import { GlassSurface } from "@/ui/GlassSurface";

import { createDockStyles, tabStyles } from "./navigation.styles";

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>["tabBar"]>>[0];
type TabIcon = ComponentProps<typeof Feather>["name"];

const tabDetails: Record<string, { title: string; icon: TabIcon }> = {
  scan: { title: "Scan", icon: "camera" },
  history: { title: "History", icon: "clock" },
  settings: { title: "Settings", icon: "sliders" },
};

export function GlassTabBar({ state, descriptors, emitter, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const isKeyboardVisible = useKeyboardVisible();
  const dockStyles = createDockStyles(insets.bottom);

  if (isKeyboardVisible) return null;

  return (
    <View
      role="tablist"
      accessibilityLabel="Main navigation"
      style={[tabStyles.dock, dockStyles.position]}
    >
      <GlassSurface isPill style={tabStyles.bar}>
        {state.routes.map((route, index) => {
          const isSelected = state.index === index;
          const details = tabDetails[route.name];
          const options = descriptors[route.key].options;
          const title = details?.title ?? options.title ?? route.name;

          function handlePress() {
            const event = emitter.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isSelected && !event.defaultPrevented) {
              navigateToTab(route.key);
            }
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={options.tabBarAccessibilityLabel ?? title}
              accessibilityState={{ selected: isSelected }}
              aria-selected={isSelected}
              onPress={handlePress}
              onLongPress={() => emitter.emit({ type: "tabLongPress", target: route.key })}
              style={({ pressed }) => [
                tabStyles.item,
                isSelected && tabStyles.selectedItem,
                pressed && tabStyles.pressed,
              ]}
            >
              <Feather
                name={details?.icon ?? "circle"}
                size={sizing.icon}
                color={isSelected ? colors.accent : colors.muted}
              />
              <Text style={[tabStyles.label, isSelected && tabStyles.selectedLabel]}>{title}</Text>
            </Pressable>
          );
        })}
      </GlassSurface>
    </View>
  );
}
