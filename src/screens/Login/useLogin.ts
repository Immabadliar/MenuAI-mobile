import { useState } from "react";
import { Keyboard } from "react-native";

import { router } from "expo-router";

import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { errorMessage } from "@/hooks/useResource";
import { services } from "@/services";

type Mode = "choose" | "login" | "signup";
type Field = "email" | "password" | "confirm";

export function useLogin() {
  const [mode, setMode] = useState<Mode>("choose");
  const [field, setField] = useState<Field>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const isKeyboardVisible = useKeyboardVisible();
  const isSignUp = mode === "signup";

  function handleModeChange(nextMode: Mode) {
    Keyboard.dismiss();
    setMode(nextMode);
    setField("email");
    setPassword("");
    setConfirmation("");
    setIsPasswordVisible(false);
    setError("");
  }

  function handleBack() {
    setError("");
    if (field === "confirm") setField("password");
    else if (field === "password") setField("email");
    else handleModeChange("choose");
  }

  function handleGoogle() {
    // TODO(backend): connect Google OAuth through the auth service.
    setError("Google sign-in isn't connected yet.");
  }

  async function handleContinue() {
    if (isLoading) return;
    setError("");
    if (field === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Enter a valid email address.");
        return;
      }
      setField("password");
      return;
    }
    if (!password || (isSignUp && password.length < 8)) {
      setError(isSignUp ? "Use at least 8 characters." : "Enter your password.");
      return;
    }
    if (isSignUp && field === "password") {
      setField("confirm");
      return;
    }
    if (isSignUp && confirmation !== password) {
      setError("Your passwords don't match.");
      return;
    }
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      // TODO(backend): wire password-based login/signup here if retaining password auth.
      // The current Services contract authenticates through an emailed code.
      await services.auth.sendCode(email.trim());
      router.push({
        pathname: "/(auth)/code",
        params: { email: email.trim(), sentAt: String(Date.now()) },
      });
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    mode,
    field,
    email,
    setEmail,
    password,
    setPassword,
    confirmation,
    setConfirmation,
    isPasswordVisible,
    setIsPasswordVisible,
    isLoading,
    error,
    isKeyboardVisible,
    isSignUp,
    handleModeChange,
    handleBack,
    handleGoogle,
    handleContinue,
  };
}
