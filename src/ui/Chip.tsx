import { Pressable, Text } from "react-native";

import { haptics } from "@/lib/haptics";
import { typography } from "@/theme";

import { styles } from "./components.styles";
import { GlassSurface } from "./GlassSurface";

export function Chip({
  label,
  selected = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  function handlePress() {
    haptics.tap();
    onPress();
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={handlePress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <GlassSurface isPill style={[styles.chip, selected && styles.selectedChip]}>
        <Text style={[typography.caption, selected && styles.selectedText]}>{label}</Text>
      </GlassSurface>
    </Pressable>
  );
}
