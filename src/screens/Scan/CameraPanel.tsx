import { useEffect } from "react";
import { Text, View } from "react-native";

import { CameraView } from "expo-camera";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { motion, typography } from "@/theme";
import { Button, Card, Loading } from "@/ui";

import { styles } from "./Scan.styles";
import type { useScan } from "./useScan";

export function CameraPanel({ flow }: { flow: ReturnType<typeof useScan> }) {
  const {
    camera,
    permission,
    isFocused,
    isReady,
    setIsReady,
    pages,
    busy,
    setError,
    captureCount,
    handleCapture,
    handlePermission,
  } = flow;
  const opacity = useSharedValue(0);
  const isReducedMotion = useReducedMotion();
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));
  useEffect(() => {
    if (captureCount > 0 && !isReducedMotion) {
      opacity.set(1);
      opacity.set(withTiming(0, { duration: motion.shutter }));
    }
  }, [captureCount, isReducedMotion, opacity]);
  if (!permission) return <Loading message="Checking camera access…" />;
  if (!permission.granted)
    return (
      <Card>
        <Text style={typography.heading}>Camera access needed</Text>
        <Text style={typography.caption}>
          Allow photos of the menu, or import a screenshot below.
        </Text>
        <Button
          title={permission.canAskAgain ? "Allow camera" : "Open Settings"}
          variant="outline"
          onPress={() => void handlePermission()}
        />
      </Card>
    );
  return (
    <>
      {isFocused && (
        <View style={styles.cameraFrame}>
          <CameraView
            ref={camera}
            style={styles.camera}
            facing="back"
            onCameraReady={() => setIsReady(true)}
            onMountError={({ message }) => {
              setIsReady(false);
              setError(message);
            }}
          />
          <Animated.View style={[styles.flash, animatedStyle]} />
        </View>
      )}
      <Button
        title={`Capture page (${pages.length}/3)`}
        variant="outline"
        loading={busy === "capture"}
        disabled={!isReady || !!busy || pages.length === 3}
        onPress={() => void handleCapture()}
      />
    </>
  );
}
