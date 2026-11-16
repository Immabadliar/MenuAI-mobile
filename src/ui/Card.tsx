import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { styles } from "./components.styles";
import { GlassSurface } from "./GlassSurface";

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <GlassSurface style={[styles.card, style]}>{children}</GlassSurface>;
}
