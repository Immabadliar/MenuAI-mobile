import { useState, type ReactNode } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

import { colors, typography } from "@/theme";

import { styles } from "./components.styles";
import { GlassSurface } from "./GlassSurface";

export function TextField({
  label,
  error,
  style,
  multiline,
  trailingAction,
  ...props
}: TextInputProps & { label?: string; error?: string; trailingAction?: ReactNode }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.field}>
      {label && <Text style={typography.label}>{label}</Text>}
      <GlassSurface
        style={[styles.inputFrame, isFocused && styles.focused, error && styles.invalid]}
      >
        <View style={styles.inputRow}>
          <TextInput
            {...props}
            accessibilityLabel={props.accessibilityLabel ?? label ?? props.placeholder}
            placeholderTextColor={colors.muted}
            multiline={multiline}
            onFocus={(event) => {
              setIsFocused(true);
              props.onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              props.onBlur?.(event);
            }}
            style={[
              styles.input,
              !!trailingAction && styles.flexInput,
              multiline && styles.multiline,
              style,
            ]}
          />
          {trailingAction}
        </View>
      </GlassSurface>
      {!!error && (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}
