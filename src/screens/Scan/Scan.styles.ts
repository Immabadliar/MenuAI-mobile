import { StyleSheet } from "react-native";

import { colors, radius, sizing, space } from "@/theme";

export const styles = StyleSheet.create({
  cameraFrame: {
    height: sizing.cameraHeight,
    borderRadius: radius.medium,
    overflow: "hidden",
    backgroundColor: colors.camera,
  },
  camera: { flex: 1 },
  flash: {
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.surface,
  },
  thumbnailButton: { gap: space.xs, minWidth: sizing.touch, minHeight: sizing.touch },
  thumbnail: { width: sizing.thumbnail, height: sizing.thumbnail, borderRadius: radius.small },
});
