import { ActivityIndicator, Pressable, Text } from "react-native";

import { colors, typography } from "@/theme";

import { styles } from "./components.styles";
import { GlassSurface } from "./GlassSurface";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "text";
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
};
export function Button({
  title,
  onPress,
  variant = "primary",
  loading,
  disabled,
  accessibilityLabel,
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const content = loading ? (
    <ActivityIndicator color={isPrimary ? colors.surface : colors.ink} />
  ) : (
    <Text style={[typography.label, isPrimary ? styles.whiteText : styles.accentText]}>
      {title}
    </Text>
  );
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "text" && styles.text,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {variant === "text" ? (
        content
      ) : (
        <GlassSurface isPill isPrimary={isPrimary} style={styles.buttonContent}>
          {content}
        </GlassSurface>
      )}
    </Pressable>
  );
}
