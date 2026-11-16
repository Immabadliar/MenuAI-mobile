import { StyleSheet } from "react-native";

import { glass } from "@/theme";

export const webStyles = StyleSheet.create({
  primaryMaterial: { backgroundImage: glass.primarySheen },
  material: { backdropFilter: glass.blur, backgroundImage: glass.sheen },
  refractive: { backdropFilter: glass.webFilter },
});
