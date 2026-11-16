import { useEffect } from "react";
import { Text } from "react-native";

import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { motion, typography } from "@/theme";

import { styles } from "./components.styles";

export function Loading({ message = "Loading…" }: { message?: string }) {
  const opacity = useSharedValue(1);
  const isReducedMotion = useReducedMotion();
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  useEffect(() => {
    if (!isReducedMotion) {
      opacity.set(
        withRepeat(
          withSequence(
            withTiming(motion.skeletonOpacity, { duration: motion.pulse }),
            withTiming(1, { duration: motion.pulse }),
          ),
          -1,
        ),
      );
    }
    return () => cancelAnimation(opacity);
  }, [isReducedMotion, opacity]);

  return (
    <Animated.View
      accessibilityLabel={message}
      accessibilityRole="progressbar"
      style={[styles.loading, animatedStyle]}
    >
      <Text style={typography.caption}>{message}</Text>
      <Animated.View style={styles.skeletonShort} />
      <Animated.View style={styles.skeletonLine} />
      <Animated.View style={styles.skeletonLine} />
    </Animated.View>
  );
}
