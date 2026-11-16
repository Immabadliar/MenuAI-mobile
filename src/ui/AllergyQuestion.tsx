import { Text, View } from "react-native";

import { typography } from "@/theme";

import { Chip, TextField, layout } from ".";

export const commonAllergies = [
  "Milk",
  "Eggs",
  "Peanuts",
  "Tree nuts",
  "Soy",
  "Wheat",
  "Fish",
  "Shellfish",
  "Sesame",
];
export function splitAllergies(text: string) {
  return text
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}
export function AllergyQuestion({
  selected,
  onChange,
  other,
  onOtherChange,
  none,
  onNoneChange,
}: {
  selected: string[];
  onChange: (values: string[]) => void;
  other: string;
  onOtherChange: (value: string) => void;
  none: boolean;
  onNoneChange: (value: boolean) => void;
}) {
  return (
    <View style={layout.stack}>
      <Text style={typography.heading}>Any food allergies?</Text>
      <Text style={typography.caption}>Select your allergies, add others, or choose None.</Text>
      <View style={layout.row}>
        {commonAllergies.map((label) => (
          <Chip
            key={label}
            label={label}
            selected={selected.includes(label)}
            onPress={() => {
              onNoneChange(false);
              onChange(
                selected.includes(label)
                  ? selected.filter((value) => value !== label)
                  : [...selected, label],
              );
            }}
          />
        ))}
        <Chip
          label="None"
          selected={none}
          onPress={() => {
            onNoneChange(!none);
            onChange([]);
            onOtherChange("");
          }}
        />
      </View>
      <TextField
        label="Other allergies (separate with commas)"
        value={other}
        onChangeText={(value) => {
          onOtherChange(value);
          if (value.trim()) onNoneChange(false);
        }}
      />
    </View>
  );
}
