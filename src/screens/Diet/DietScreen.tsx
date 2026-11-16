import { Keyboard, Text, TextInput } from "react-native";

import { colors } from "@/theme";
import { commonAllergies } from "@/ui/AllergyQuestion";
import { OnboardingStep } from "@/ui/OnboardingStep";
import { onboardingStyles as styles } from "@/ui/OnboardingStep.styles";
import { PagedChoices } from "@/ui/PagedChoices";

import { questions, useDiet } from "./useDiet";

export default function DietScreen() {
  const {
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
  } = useDiet();
  return (
    <OnboardingStep
      title={questions[step]}
      step={step + 1}
      total={hasOther ? 4 : 3}
      onBack={back}
      onNext={() => void next()}
      nextTitle={step >= 2 && !(step === 2 && hasOther) ? "Review my diet" : "Continue"}
      loading={loading}
      error={error}
      showDisclaimer={step === 1}
    >
      {step === 0 && (
        <>
          <TextInput
            accessibilityLabel="Search diets"
            placeholder="Search diets or preferences"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
          />
          {!keyboardVisible && (
            <Text style={styles.caption}>
              {selectedStyles.length
                ? `${selectedStyles.length} selected`
                : "Choose any that fit, or describe your own next."}
            </Text>
          )}
          {!keyboardVisible && filteredSuggestions.length === 0 && (
            <Text style={styles.caption}>No matches. You can describe this on the next step.</Text>
          )}
          {!keyboardVisible && (
            <PagedChoices
              key={search.trim().toLowerCase()}
              maxVisible={maxVisibleChoices}
              values={filteredSuggestions}
              selected={selectedStyles}
              onToggle={(label) =>
                setSelectedStyles((current) =>
                  current.includes(label)
                    ? current.filter((value) => value !== label)
                    : [...current, label],
                )
              }
            />
          )}
        </>
      )}
      {step === 1 && (
        <>
          {!keyboardVisible && (
            <Text style={styles.caption}>Your goals, preferences, and anything you limit.</Text>
          )}
          <TextInput
            accessibilityLabel="Tell us how you eat"
            placeholder="I'm vegetarian, prefer high-protein meals, and like plenty of vegetables…"
            placeholderTextColor={colors.muted}
            multiline
            style={[styles.input, styles.multiline]}
            value={text}
            onChangeText={setText}
          />
        </>
      )}
      {step === 2 && (
        <PagedChoices
          values={[...commonAllergies, "Other", "None"]}
          selected={[...allergies, ...(hasOther ? ["Other"] : []), ...(none ? ["None"] : [])]}
          onToggle={(label) => {
            if (label === "None") {
              setNone(!none);
              setAllergies([]);
              setOther("");
              setHasOther(false);
            } else if (label === "Other") {
              setNone(false);
              setHasOther(!hasOther);
              if (hasOther) setOther("");
            } else {
              setNone(false);
              setAllergies((current) =>
                current.includes(label)
                  ? current.filter((value) => value !== label)
                  : [...current, label],
              );
            }
          }}
        />
      )}
      {step === 3 && (
        <TextInput
          accessibilityLabel="Other food allergies"
          placeholder="Separate allergies with commas"
          placeholderTextColor={colors.muted}
          style={[styles.input, styles.multiline]}
          multiline
          value={other}
          onChangeText={setOther}
        />
      )}
    </OnboardingStep>
  );
}
