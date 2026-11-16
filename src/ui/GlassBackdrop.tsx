import { useEffect } from "react";
import { View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { glass, motion, sizing } from "@/theme";

import { styles } from "./GlassSurface.styles";

export function GlassBackdrop({ isImmersive = false }: { isImmersive?: boolean }) {
  const light = useSharedValue(0);
  const isReducedMotion = useReducedMotion();
  const lightStyle = useAnimatedStyle(() => ({ transform: [{ translateX: light.get() }] }));

  useEffect(() => {
    if (!isReducedMotion) {
      light.set(withRepeat(withTiming(sizing.lightTravel, { duration: motion.ambient }), -1, true));
    }
    return () => cancelAnimation(light);
  }, [isReducedMotion, light]);

  return (
    <View style={styles.backdrop}>
      <LinearGradient
        colors={glass.backdrop}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fill}
      />
      <Animated.View style={[styles.fill, lightStyle]}>
        <LinearGradient
          colors={glass.highlight}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.daylight}
        />
      </Animated.View>
      <View style={[styles.fill, isImmersive ? styles.immersiveVeil : styles.veil]} />
    </View>
  );
}
