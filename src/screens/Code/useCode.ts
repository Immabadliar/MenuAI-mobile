import { useEffect, useState } from "react";

import { useLocalSearchParams } from "expo-router";

import { errorMessage } from "@/hooks/useResource";
import { services } from "@/services";

export function useCode() {
  const { email = "", sentAt } = useLocalSearchParams<{
    email: string;
    sentAt?: string;
  }>();
  const [code, setCode] = useState("");
  const [nextResend, setNextResend] = useState(() => Number(sentAt || Date.now()) + 30000);
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState<"verify" | "resend" | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const seconds = Math.max(0, Math.ceil((nextResend - now) / 1000));
  async function verify() {
    if (busy) return;
    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setBusy("verify");
    setError("");
    try {
      await services.auth.verifyCode(email, code);
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(null);
    }
  }
  async function resend() {
    if (busy || seconds > 0) return;
    setBusy("resend");
    setError("");
    try {
      await services.auth.sendCode(email);
      setNextResend(Date.now() + 30000);
      setCode("");
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(null);
    }
  }
  return { email, code, setCode, busy, error, seconds, verify, resend };
}
