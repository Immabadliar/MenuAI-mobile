import { useState } from "react";

import { router } from "expo-router";

import { errorMessage } from "@/hooks/useResource";
import { services } from "@/services";

export function useEmail() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function send() {
    if (loading) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await services.auth.sendCode(email.trim());
      router.push({
        pathname: "/(auth)/code",
        params: { email: email.trim(), sentAt: String(Date.now()) },
      });
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setLoading(false);
    }
  }
  return { email, setEmail, error, loading, send };
}
