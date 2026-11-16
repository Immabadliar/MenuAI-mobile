import { useState } from "react";
import { Keyboard, useWindowDimensions } from "react-native";

import { router } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { useDietDraft } from "@/hooks/useDietDraft";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { errorMessage } from "@/hooks/useResource";
import { dietOptions } from "@/lib/dietOptions";
import { sizing } from "@/theme";
import { services } from "@/services";
import { commonAllergies, splitAllergies } from "@/ui/AllergyQuestion";

export const questions = [
  "How do you like to eat?",
  "Tell us a little more.",
  "Any food allergies?",
  "Any other allergies?",
];
export function useDiet() {
  const { profile } = useAuth();
  const { draft, setDraft } = useDietDraft();
  const initialAllergies = draft?.allergies ?? profile?.allergies ?? [];
  const [step, setStep] = useState(0);
  const { height, fontScale } = useWindowDimensions();
  const maxVisibleChoices =
    height < sizing.compactHeight || fontScale > sizing.largeTextScale
      ? sizing.compactDietChoices
      : sizing.dietChoicesPerPage;
  const [search, setSearch] = useState("");
  const filteredSuggestions = dietOptions.filter((option) =>
    option.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [text, setText] = useState(draft?.text ?? profile?.dietText ?? "");
  const [allergies, setAllergies] = useState(
    initialAllergies.filter((value) => commonAllergies.includes(value)),
  );
  const [other, setOther] = useState(
    initialAllergies.filter((value) => !commonAllergies.includes(value)).join(", "),
  );
  const [none, setNone] = useState((!!draft || !!profile) && initialAllergies.length === 0);
  const [hasOther, setHasOther] = useState(other.length > 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const keyboardVisible = useKeyboardVisible();
  function back() {
    Keyboard.dismiss();
    setError("");
    if (step > 0) {
      setStep(step - 1);
    } else if (profile) {
      router.replace("/(tabs)/settings");
    } else {
      void services.auth.signOut().catch((failure: unknown) => {
        setError(errorMessage(failure));
      });
    }
  }
  async function next() {
    if (loading) return;
    setError("");
    Keyboard.dismiss();

    if (step === 0) {
      const additions = selectedStyles.filter(
        (value) => !text.toLowerCase().includes(value.toLowerCase()),
      );
      setText([text.trim(), additions.join(", ")].filter(Boolean).join(". "));
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!text.trim()) {
        setError("Tell us how you eat first.");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!none && !allergies.length && !hasOther) {
        setError("Choose your allergies, Other, or None.");
        return;
      }
      if (hasOther) {
        setStep(3);
        return;
      }
    }
    if (step === 3 && splitAllergies(other).length === 0) {
      setError("Enter your other allergies.");
      return;
    }

    setLoading(true);
    try {
      const selected = none ? [] : [...new Set([...allergies, ...splitAllergies(other)])];
      const parsed = await services.profile.parseDiet(text.trim());
      setDraft({
        text: text.trim(),
        allergies: selected,
        parsed: { ...parsed, allergies: selected },
      });
      router.push("/(onboarding)/review");
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setLoading(false);
    }
  }
  return {
    step,
    maxVisibleChoices,
    search,
    setSearch,
    filteredSuggestions,
    selectedStyles,
    setSelectedStyles,
    text,
    setText,
    allergies,
    setAllergies,
    other,
    setOther,
    none,
    setNone,
    hasOther,
    setHasOther,
    loading,
    error,
    keyboardVisible,
    back,
    next,
  };
}
