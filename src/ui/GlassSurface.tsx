import type { PropsWithChildren } from "react";
import { Platform, View, type StyleProp, type ViewStyle } from "react-native";

import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";

import { useReduceTransparency } from "@/hooks/useReduceTransparency";
import { colors } from "@/theme";

import { styles } from "./GlassSurface.styles";

export function GlassSurface({
  children,
  style,
  isPill = false,
  isPrimary = false,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle>; isPill?: boolean; isPrimary?: boolean }>) {
  const isReduced = useReduceTransparency();
  const hasNativeGlass =
    Platform.OS === "ios" && !isReduced && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
  const shape = isPill ? styles.pill : styles.rounded;
  return (
    <View
      style={[
        styles.shell,
        shape,
        hasNativeGlass ? styles.native : styles.material,
        isReduced && styles.solid,
        isPrimary && styles.primary,
        style,
      ]}
    >
      {hasNativeGlass && (
        <GlassView
          glassEffectStyle="regular"
          tintColor={isPrimary ? colors.accent : colors.glassTint}
          colorScheme={isPrimary ? "dark" : "light"}
          style={[styles.fill, shape]}
        />
      )}
      {children}
    </View>
  );
}
