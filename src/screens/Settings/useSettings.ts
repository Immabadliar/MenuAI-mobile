import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { useFocusEffect } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { useDietDraft } from "@/hooks/useDietDraft";
import { errorMessage, useResource } from "@/hooks/useResource";
import { services } from "@/services";

const load = async () => {
  const [companions, plan] = await Promise.all([
    services.companions.list(),
    services.billing.getPlan(),
  ]);
  return { companions, plan };
};

export function useSettings() {
  const { profile } = useAuth();
  const { setDraft } = useDietDraft();
  const resource = useResource(load);
  const [name, setName] = useState(profile?.displayName ?? "");
  const [busy, setBusy] = useState<"name" | "signout" | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const { reload } = resource;
  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );
  async function saveName() {
    if (busy) return;
    if (!name.trim()) {
      setError("Enter a display name.");
      return;
    }
    setBusy("name");
    setError("");
    setNotice("");
    try {
      await services.profile.saveProfile({ displayName: name.trim() });
      setNotice("Display name saved.");
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(null);
    }
  }
  async function signOut() {
    if (busy) return;
    setBusy("signout");
    setError("");
    try {
      await services.auth.signOut();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(null);
    }
  }
  function deleteAccount() {
    Alert.alert(
      "Delete account?",
      "This will permanently remove your account and saved menus when account deletion is connected.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete account",
          style: "destructive",
          onPress: () => {
            // TODO(backend): add an authenticated account deletion service and call it here, then clear the session.
            setNotice("Account deletion isn't connected in this frontend demo.");
          },
        },
      ],
    );
  }
  return {
    profile,
    setDraft,
    resource,
    name,
    setName,
    busy,
    error,
    notice,
    saveName,
    signOut,
    deleteAccount,
  };
}
