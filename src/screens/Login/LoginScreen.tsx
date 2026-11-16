import { Keyboard, KeyboardAvoidingView, Platform, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/ui";
import { GlassBackdrop } from "@/ui/GlassBackdrop";
import { GlassSurface } from "@/ui/GlassSurface";

import { GoogleButton } from "./GoogleButton";
import { styles } from "./Login.styles";
import { LoginForm } from "./LoginForm";
import { useLogin } from "./useLogin";

export default function LoginScreen() {
  const login = useLogin();
  const isChoosing = login.mode === "choose";
  const title = isChoosing
    ? "Welcome to MenuAI."
    : login.isSignUp
      ? "Create an account."
      : "Log in.";

  return (
    <SafeAreaView style={styles.screen}>
      <GlassBackdrop isImmersive={isChoosing} />
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={styles.container}
          onStartShouldSetResponder={() => {
            Keyboard.dismiss();
            return false;
          }}
        >
          {!login.isKeyboardVisible && (
            <View style={styles.header}>
              <Text style={[styles.brand, isChoosing && styles.brandOnBackdrop]}>MENUAI</Text>
              {!isChoosing && <Button title="Back" variant="text" onPress={login.handleBack} />}
            </View>
          )}

          <View
            style={[
              styles.body,
              isChoosing && styles.choiceBody,
              login.isKeyboardVisible && styles.keyboardBody,
            ]}
          >
            <Text style={[styles.title, isChoosing && styles.titleOnBackdrop]}>{title}</Text>
            {isChoosing ? (
              <GlassSurface style={styles.choicePanel}>
                <Button title="Log in" onPress={() => login.handleModeChange("login")} />
                <Button
                  title="Sign up"
                  variant="outline"
                  onPress={() => login.handleModeChange("signup")}
                />
                <GoogleButton onPress={login.handleGoogle} />
                {login.error !== "" && (
                  <Text accessibilityLiveRegion="polite" style={styles.error}>
                    {login.error}
                  </Text>
                )}
              </GlassSurface>
            ) : (
              <LoginForm login={login} />
            )}
          </View>

          {!isChoosing && (
            <View style={styles.footer}>
              <Button
                title="Continue"
                loading={login.isLoading}
                onPress={() => void login.handleContinue()}
              />
              {!login.isKeyboardVisible && (
                <Button
                  title={login.isSignUp ? "Already have an account? Log in" : "New here? Sign up"}
                  variant="text"
                  onPress={() => login.handleModeChange(login.isSignUp ? "login" : "signup")}
                />
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
