import type { PropsWithChildren } from "react";
import { useSyncExternalStore } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { glass } from "@/theme";

import { webStyles } from "./glass.web.styles";
import { styles } from "./GlassSurface.styles";

function subscribe() {
  return () => undefined;
}
function getSnapshot() {
  return typeof CSS !== "undefined" && CSS.supports("backdrop-filter", glass.webFilter);
}

export function GlassSurface({
  children,
  style,
  isPill = false,
  isPrimary = false,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle>; isPill?: boolean; isPrimary?: boolean }>) {
  const hasRefraction = useSyncExternalStore(subscribe, getSnapshot, () => false);
  return (
    <View
      style={[
        styles.shell,
        isPill ? styles.pill : styles.rounded,
        styles.material,
        webStyles.material,
        hasRefraction && webStyles.refractive,
        isPrimary && styles.primary,
        isPrimary && webStyles.primaryMaterial,
        style,
      ]}
    >
      {children}
    </View>
  );
}
