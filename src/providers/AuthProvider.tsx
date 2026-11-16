import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from "react";

import { errorMessage } from "@/hooks/useResource";
import { services } from "@/services";
import type { Profile, Session } from "@/types";

import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const current = await services.auth.getSession();
      const currentProfile = current ? await services.profile.getProfile() : null;
      if (request === generation.current) {
        setSession(current);
        setProfile(currentProfile);
      }
    } catch (failure) {
      if (request === generation.current) setError(errorMessage(failure));
    } finally {
      if (request === generation.current) {
        setLoading(false);
        setIsInitialized(true);
      }
    }
  }, []);
  useEffect(() => {
    queueMicrotask(() => void refresh());
    const unsubscribe = services.auth.onAuthChange(() => {
      queueMicrotask(() => void refresh());
    });
    return () => {
      unsubscribe();
      generation.current += 1;
    };
  }, [refresh]);
  return (
    <AuthContext.Provider value={{ session, profile, loading, isInitialized, error, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
