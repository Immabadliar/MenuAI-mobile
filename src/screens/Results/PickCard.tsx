import { Text, View } from "react-native";

import { router } from "expo-router";
import Animated, { FadeInUp, ReduceMotion } from "react-native-reanimated";

import { motion } from "@/theme";
import type { Pick } from "@/types";
import { Badge, Button } from "@/ui";
import { GlassSurface } from "@/ui/GlassSurface";

import { createFitStyles, styles } from "./Results.styles";

export function PickCard({
  pick,
  index,
  scanId,
  personId,
}: {
  pick: Pick;
  index: number;
  scanId: string;
  personId: string;
}) {
  const fitStyles = createFitStyles(pick.fit);
  function handleOrder() {
    router.push({
      pathname: "/scan/order",
      params: { id: scanId, person: personId, dish: pick.dish },
    });
  }
  return (
    <Animated.View
      entering={FadeInUp.duration(motion.duration)
        .delay(index * motion.stagger)
        .reduceMotion(ReduceMotion.System)}
    >
      <GlassSurface style={styles.pick}>
        <Text style={styles.dish}>{pick.dish}</Text>
        <Text style={styles.why}>{pick.why}</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.score}>{pick.fit}% fit</Text>
          <Badge confidence={pick.confidence} />
        </View>
        <View accessibilityLabel={`${pick.fit} percent diet fit`} style={styles.bar}>
          <View style={fitStyles.fill} />
        </View>
        <Button title="How to order →" variant="text" onPress={handleOrder} />
      </GlassSurface>
    </Animated.View>
  );
}
