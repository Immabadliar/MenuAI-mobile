import { type PropsWithChildren } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { useSegments } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "./components.styles";
import { GlassBackdrop } from "./GlassBackdrop";

export function Screen({
  children,
  scroll = true,
  isImmersive = false,
}: PropsWithChildren<{ scroll?: boolean; isImmersive?: boolean }>) {
  const segments = useSegments();
  const hasTabs = segments[0] === "(tabs)";
  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <GlassBackdrop isImmersive={isImmersive} />
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={[styles.content, hasTabs && styles.tabContent]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            bounces={false}
            onStartShouldSetResponder={() => {
              Keyboard.dismiss();
              return false;
            }}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, hasTabs && styles.tabContent]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
