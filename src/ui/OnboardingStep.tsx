import type { PropsWithChildren } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";

import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { colors, disclaimer, sizing } from "@/theme";

import { Button } from "./Button";
import { GlassBackdrop } from "./GlassBackdrop";
import { GlassSurface } from "./GlassSurface";
import { onboardingStyles } from "./OnboardingStep.styles";
import { createProgressStyles } from "./progress.styles";

export function OnboardingStep({
  children,
  title,
  step,
  total,
  onBack,
  onNext,
  nextTitle = "Continue",
  loading = false,
  error = "",
  showDisclaimer = false,
}: PropsWithChildren<{
  title: string;
  step: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  nextTitle?: string;
  loading?: boolean;
  error?: string;
  showDisclaimer?: boolean;
}>) {
  const keyboardVisible = useKeyboardVisible();
  const progressStyles = createProgressStyles(step, total);

  return (
    <SafeAreaView style={onboardingStyles.background}>
      <GlassBackdrop />
      <KeyboardAvoidingView
        style={onboardingStyles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={onboardingStyles.screen}
          onStartShouldSetResponder={() => {
            Keyboard.dismiss();
            return false;
          }}
        >
          {!keyboardVisible && (
            <View style={onboardingStyles.header}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                disabled={loading}
                onPress={onBack}
                style={onboardingStyles.backButton}
              >
                <Feather name="arrow-left" size={sizing.icon} color={colors.ink} />
              </Pressable>
              <Text style={onboardingStyles.brand}>MenuAI</Text>
              <Text style={onboardingStyles.progress}>
                {step}/{total}
              </Text>
            </View>
          )}

          {!keyboardVisible && (
            <View
              accessibilityLabel={`Step ${step} of ${total}`}
              accessibilityRole="progressbar"
              style={progressStyles.track}
            >
              <View style={progressStyles.fill} />
            </View>
          )}
          <Text style={onboardingStyles.title}>{title}</Text>
          <GlassSurface style={onboardingStyles.body}>{children}</GlassSurface>

          <View style={onboardingStyles.footer}>
            {error !== "" && (
              <Text accessibilityRole="alert" style={onboardingStyles.error}>
                {error}
              </Text>
            )}
            {showDisclaimer && !keyboardVisible && (
              <Text style={onboardingStyles.caption}>{disclaimer}</Text>
            )}
            <Button title={nextTitle} loading={loading} onPress={onNext} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
