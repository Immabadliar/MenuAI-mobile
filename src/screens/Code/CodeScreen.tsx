import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { styles } from "@/screens/Login/Login.styles";
import { typography } from "@/theme";
import { Button, TextField } from "@/ui";
import { GlassBackdrop } from "@/ui/GlassBackdrop";

import { useCode } from "./useCode";

export default function CodeScreen() {
  const { email, code, setCode, busy, error, seconds, verify, resend } = useCode();
  const isKeyboardVisible = useKeyboardVisible();
  return (
    <SafeAreaView style={styles.screen}>
      <GlassBackdrop />
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {!isKeyboardVisible && (
            <Button title="Change email" variant="text" onPress={() => router.back()} />
          )}
          <View style={[styles.body, isKeyboardVisible && styles.keyboardBody]}>
            <Text style={typography.displaySmall}>Check your email.</Text>
            {!isKeyboardVisible && (
              <Text style={typography.caption}>{email} · Demo code 123456</Text>
            )}
            <TextField
              label="6-digit code"
              value={code}
              onChangeText={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              maxLength={6}
              error={error}
              onSubmitEditing={() => void verify()}
            />
          </View>
          <View style={styles.footer}>
            <Button
              title="Verify code"
              loading={busy === "verify"}
              disabled={code.length !== 6 || busy === "resend"}
              onPress={() => void verify()}
            />
            {!isKeyboardVisible && (
              <Button
                title={seconds ? `Resend code in ${seconds}s` : "Resend code"}
                variant="text"
                loading={busy === "resend"}
                disabled={seconds > 0 || busy === "verify"}
                onPress={() => void resend()}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
