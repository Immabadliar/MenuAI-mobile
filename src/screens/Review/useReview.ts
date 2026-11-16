import { useState } from "react";
import { Keyboard } from "react-native";

import { router } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { useDietDraft } from "@/hooks/useDietDraft";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { errorMessage } from "@/hooks/useResource";
import { services } from "@/services";

export const groups = ["style", "avoid", "prefer", "allergies"] as const;
export const questions = [
  "Does this describe your diet?",
  "Anything you avoid?",
  "What do you prefer?",
  "Are these your allergies?",
  "A calorie target per meal?",
  "Anything else we should know?",
];
export function useReview() {
  const { draft, setDraft } = useDietDraft();
  const { refresh } = useAuth();
  const [step, setStep] = useState(0);
  const [parsed, setParsed] = useState(draft?.parsed);
  const [addition, setAddition] = useState("");
  const [calories, setCalories] = useState(draft?.parsed.limit.calories_per_meal?.toString() ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const keyboardVisible = useKeyboardVisible();
  const group = groups[step];
  function addChip() {
    const value = addition.trim();
    if (parsed && group && value && !parsed[group].includes(value)) {
      setParsed({ ...parsed, [group]: [...parsed[group], value] });
    }
    setAddition("");
    Keyboard.dismiss();
  }
  async function next() {
    if (!draft || !parsed || loading) return;
    Keyboard.dismiss();
    setError("");
    if (addition.trim() && group) {
      addChip();
      return;
    }
    if (step === 4 && calories && (!/^\d+$/.test(calories) || Number(calories) <= 0)) {
      setError("Enter a positive calorie limit or leave it blank.");
      return;
    }
    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const dietProfile = {
        ...parsed,
        limit: calories ? { calories_per_meal: Number(calories) } : {},
      };
      await services.profile.saveProfile({
        dietText: draft.text,
        dietProfile,
        allergies: parsed.allergies,
      });
      setDraft(null);
      await refresh();
      router.replace("/(tabs)/scan");
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setLoading(false);
    }
  }
  return {
    draft,
    step,
    setStep,
    parsed,
    setParsed,
    addition,
    setAddition,
    calories,
    setCalories,
    loading,
    error,
    setError,
    keyboardVisible,
    group,
    addChip,
    next,
  };
}
