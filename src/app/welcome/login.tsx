import { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputInstance,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles as welcomeStyles } from "./welcome";

type Mode = "choose" | "login" | "signup";
type Errors = { email?: string; password?: string; confirmPassword?: string };

export default function Login() {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [mode, setMode] = useState<Mode>("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");
  const passwordInput = useRef<TextInputInstance>(null);
  const confirmInput = useRef<TextInputInstance>(null);
  const isSignUp = mode === "signup";

  function changeMode(nextMode: Mode) {
    Keyboard.dismiss();
    setMode(nextMode);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setErrors({});
    setNotice("");
  }

  function submit() {
    const nextErrors: Errors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Enter your password.";
    } else if (isSignUp && password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }
    if (isSignUp && confirmPassword !== password) {
      nextErrors.confirmPassword = "Your passwords don't match.";
    }

    setErrors(nextErrors);
    setNotice("");
    if (Object.keys(nextErrors).length > 0) return;

    Keyboard.dismiss();
    // Replace this notice with the auth request when the backend is connected.
    setNotice("This form is ready. Account access isn't connected yet.");
  }

  return (
    <SafeAreaView style={welcomeStyles.safe}>
      <Text style={styles.top}>MenuAI</Text>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.screen}
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          scrollEnabled={contentHeight > viewportHeight + 1}
          onLayout={({ nativeEvent }) => {
            setViewportHeight(nativeEvent.layout.height);
          }}
          onContentSizeChange={(_, height) => setContentHeight(height)}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onStartShouldSetResponder={() => {
            Keyboard.dismiss();
            return false;
          }}
        >
          <View style={styles.content}>
            <Text style={welcomeStyles.h1}>
              {isSignUp ? "Create your account" : "Welcome back"}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp ? "Good food starts with you." : "Your next good order is waiting."}
            </Text>

            {mode === "choose" ? (
              <View style={styles.buttons}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => changeMode("login")}
                  style={welcomeStyles.button}
                >
                  <Text style={welcomeStyles.buttonText}>Log in</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => changeMode("signup")}
                  style={[welcomeStyles.button, styles.secondaryButton]}
                >
                  <Text style={styles.secondaryText}>Sign up</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    accessibilityLabel="Email"
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="you@example.com"
                    placeholderTextColor="#96909A"
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      setErrors((current) => ({ ...current, email: undefined }));
                      setNotice("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => passwordInput.current?.focus()}
                  />
                  {errors.email && <Text style={styles.error}>{errors.email}</Text>}
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Password</Text>
                  <View style={[styles.passwordRow, errors.password && styles.inputError]}>
                    <TextInput
                      ref={passwordInput}
                      accessibilityLabel="Password"
                      style={styles.passwordInput}
                      placeholder={isSignUp ? "At least 8 characters" : "Your password"}
                      placeholderTextColor="#96909A"
                      value={password}
                      onChangeText={(value) => {
                        setPassword(value);
                        setErrors((current) => ({ ...current, password: undefined }));
                        setNotice("");
                      }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                      returnKeyType={isSignUp ? "next" : "done"}
                      submitBehavior={isSignUp ? "submit" : "blurAndSubmit"}
                      onSubmitEditing={() => isSignUp ? confirmInput.current?.focus() : submit()}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.showButton}
                    >
                      <Text style={styles.link}>{showPassword ? "Hide" : "Show"}</Text>
                    </Pressable>
                  </View>
                  {errors.password && <Text style={styles.error}>{errors.password}</Text>}
                </View>

                {isSignUp && (
                  <View style={styles.field}>
                    <Text style={styles.label}>Confirm password</Text>
                    <TextInput
                      ref={confirmInput}
                      accessibilityLabel="Confirm password"
                      style={[styles.input, errors.confirmPassword && styles.inputError]}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#96909A"
                      value={confirmPassword}
                      onChangeText={(value) => {
                        setConfirmPassword(value);
                        setErrors((current) => ({ ...current, confirmPassword: undefined }));
                        setNotice("");
                      }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="new-password"
                      returnKeyType="done"
                      onSubmitEditing={submit}
                    />
                    {errors.confirmPassword && (
                      <Text style={styles.error}>{errors.confirmPassword}</Text>
                    )}
                  </View>
                )}

                <Pressable
                  accessibilityRole="button"
                  onPress={submit}
                  style={({ pressed }) => [
                    welcomeStyles.button,
                    pressed && welcomeStyles.buttonPressed,
                  ]}
                >
                  <Text style={welcomeStyles.buttonText}>
                    {isSignUp ? "Create account" : "Continue"}
                  </Text>
                </Pressable>
                {notice !== "" && (
                  <Text accessibilityLiveRegion="polite" style={styles.subtitle}>{notice}</Text>
                )}
                <View style={styles.switchRow}>
                  <Text style={styles.subtitle}>
                    {isSignUp ? "Already have an account?" : "New to menuai?"}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    hitSlop={10}
                    onPress={() => changeMode(isSignUp ? "login" : "signup")}
                  >
                    <Text style={styles.link}>{isSignUp ? "Log in" : "Sign up"}</Text>
                  </Pressable>
                </View>
                <Pressable accessibilityRole="button" onPress={() => changeMode("choose")}>
                  <Text style={styles.back}>Back</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 432,
    alignSelf: "center",
  },
  subtitle: {
    color: "#7B747E",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  buttons: { marginTop: 24, gap: 12 },
  form: { marginTop: 28, gap: 18 },
  field: { gap: 8 },
  label: { color: "#181619", fontSize: 14, fontWeight: "600" },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: "#D6CFD8",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#181619",
    fontSize: 16,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D6CFD8",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
  },
  passwordInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#181619",
    fontSize: 16,
  },
  showButton: { padding: 14 },
  inputError: { borderColor: "#B83245" },
  error: { color: "#B83245", fontSize: 13, lineHeight: 18 },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#181619",
  },
  secondaryText: { color: "#181619", fontSize: 18, fontWeight: "600" },
  switchRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  link: { color: "#75408C", fontSize: 15, fontWeight: "600" },
  back: { color: "#7B747E", textAlign: "center", padding: 12 },
  top: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    fontSize: 36,
    fontWeight: "600",
    letterSpacing: -1.3,
    color: "#181619",
    textAlign: "center",
  },
});
