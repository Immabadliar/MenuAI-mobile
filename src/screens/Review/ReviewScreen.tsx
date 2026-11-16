import { Keyboard, Pressable, Text, TextInput } from "react-native";

import { router } from "expo-router";

import { colors } from "@/theme";
import { EmptyState, Screen } from "@/ui";
import { OnboardingStep } from "@/ui/OnboardingStep";
import { onboardingStyles as styles } from "@/ui/OnboardingStep.styles";
import { PagedChoices } from "@/ui/PagedChoices";

import { questions, useReview } from "./useReview";

export default function ReviewScreen() {
  const {
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
  } = useReview();
  if (!draft || !parsed) {
    return (
      <Screen>
        <EmptyState
          title="Tell us about your diet first"
          message="Your review will appear here."
          action={{ title: "Set up diet", onPress: () => router.replace("/(onboarding)/diet") }}
        />
      </Screen>
    );
  }
  return (
    <OnboardingStep
      title={questions[step]}
      step={step + 1}
      total={questions.length}
      onBack={() => {
        Keyboard.dismiss();
        setAddition("");
        setError("");
        if (step > 0) setStep(step - 1);
        else router.back();
      }}
      onNext={() => void next()}
      nextTitle={step === questions.length - 1 ? "Looks good" : "Continue"}
      loading={loading}
      error={error}
    >
      {group && (
        <>
          {!keyboardVisible && (
            <>
              <Text style={styles.caption}>Tap to remove an item, or add your own.</Text>
              {parsed[group].length === 0 && (
                <Text style={styles.caption}>
                  {group === "allergies" ? "None selected" : "Nothing added yet"}
                </Text>
              )}
              <PagedChoices
                values={parsed[group]}
                selected={parsed[group]}
                isRemovable
                onToggle={(value) =>
                  setParsed({
                    ...parsed,
                    [group]: parsed[group].filter((item) => item !== value),
                  })
                }
              />
            </>
          )}
          <TextInput
            accessibilityLabel={`Add ${group}`}
            placeholder={`Add ${group}`}
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={addition}
            onChangeText={setAddition}
            returnKeyType="done"
            onSubmitEditing={addChip}
          />
          <Pressable accessibilityRole="button" onPress={addChip} style={styles.backButton}>
            <Text style={styles.chipText}>Add item</Text>
          </Pressable>
        </>
      )}
      {step === 4 && (
        <>
          {!keyboardVisible && (
            <Text style={styles.caption}>Optional. Leave blank if you do not track calories.</Text>
          )}
          <TextInput
            accessibilityLabel="Calories per meal"
            placeholder="e.g. 600"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={calories}
            onChangeText={setCalories}
            keyboardType="number-pad"
          />
        </>
      )}
      {step === 5 && (
        <TextInput
          accessibilityLabel="Diet notes"
          placeholder="Any other preferences or instructions?"
          placeholderTextColor={colors.muted}
          style={[styles.input, styles.multiline]}
          multiline
          value={parsed.notes}
          onChangeText={(notes) => setParsed({ ...parsed, notes })}
        />
      )}
    </OnboardingStep>
  );
}
