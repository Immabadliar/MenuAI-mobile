import { Pressable, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { colors, sizing } from "@/theme";
import { TextField } from "@/ui";

import { styles } from "./Login.styles";
import type { useLogin } from "./useLogin";

export function LoginForm({ login }: { login: ReturnType<typeof useLogin> }) {
  const isEmail = login.field === "email";
  const isConfirmation = login.field === "confirm";
  const value = isEmail ? login.email : isConfirmation ? login.confirmation : login.password;
  const handleChange = isEmail
    ? login.setEmail
    : isConfirmation
      ? login.setConfirmation
      : login.setPassword;
  return (
    <View style={styles.choices}>
      <TextField
        key={login.field}
        label={isEmail ? "Email" : isConfirmation ? "Confirm password" : "Password"}
        placeholder={
          isEmail ? "you@example.com" : isConfirmation ? "Re-enter your password" : "Your password"
        }
        value={value}
        onChangeText={handleChange}
        keyboardType={isEmail ? "email-address" : "default"}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete={isEmail ? "email" : login.isSignUp ? "new-password" : "current-password"}
        secureTextEntry={!isEmail && !login.isPasswordVisible}
        returnKeyType="done"
        editable={!login.isLoading}
        error={login.error}
        trailingAction={
          !isEmail && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={login.isPasswordVisible ? "Hide password" : "Show password"}
              onPress={() => login.setIsPasswordVisible(!login.isPasswordVisible)}
              style={styles.passwordToggle}
            >
              <Feather
                name={login.isPasswordVisible ? "eye-off" : "eye"}
                size={sizing.smallIcon}
                color={colors.ink}
              />
            </Pressable>
          )
        }
        onSubmitEditing={() => void login.handleContinue()}
      />
    </View>
  );
}
