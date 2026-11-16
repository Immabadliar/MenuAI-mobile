import { Chip } from "./Chip";

export function OnboardingChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return <Chip label={label} selected={selected} onPress={onPress} />;
}
