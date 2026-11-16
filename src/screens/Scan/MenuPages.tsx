import { Image, Pressable, Text, View } from "react-native";

import Animated, { FadeInRight, ReduceMotion } from "react-native-reanimated";

import { motion, typography } from "@/theme";
import { EmptyState, layout } from "@/ui";

import { styles } from "./Scan.styles";
import type { useScan } from "./useScan";

export function MenuPages({ flow }: { flow: ReturnType<typeof useScan> }) {
  if (!flow.pages.length)
    return (
      <EmptyState title="Add your first page." message="A clear photo helps us read every dish." />
    );
  return (
    <View style={layout.row}>
      {flow.pages.map((page, index) => (
        <Animated.View
          key={`${page.uri}-${index}`}
          entering={FadeInRight.duration(motion.duration).reduceMotion(ReduceMotion.System)}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove menu page ${index + 1}`}
            disabled={!!flow.busy}
            onPress={() =>
              flow.setPages((current) => current.filter((_, position) => position !== index))
            }
            style={styles.thumbnailButton}
          >
            <Image source={{ uri: page.uri }} style={styles.thumbnail} />
            <Text style={typography.caption}>Remove {index + 1}</Text>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
}
