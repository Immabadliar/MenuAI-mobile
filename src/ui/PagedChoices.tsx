import { useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { colors, sizing } from "@/theme";

import { OnboardingChip } from "./OnboardingChip";
import { styles } from "./PagedChoices.styles";

export function PagedChoices({
  values,
  selected,
  onToggle,
  isRemovable = false,
  maxVisible,
}: {
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
  isRemovable?: boolean;
  maxVisible?: number;
}) {
  const { height, fontScale } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const responsiveSize =
    fontScale > sizing.largeTextScale ? 2 : height < sizing.compactHeight ? 4 : 8;
  const pageSize = Math.min(responsiveSize, maxVisible ?? responsiveSize);
  const total = Math.max(1, Math.ceil(values.length / pageSize));
  const currentPage = Math.min(page, total - 1);
  const visible = values.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <View style={styles.group}>
      <View style={styles.options}>
        {visible.map((value) => (
          <OnboardingChip
            key={value}
            label={isRemovable ? `${value} ×` : value}
            selected={selected.includes(value)}
            onPress={() => onToggle(value)}
          />
        ))}
      </View>
      {total > 1 && (
        <View style={styles.navigation}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous choices"
            disabled={currentPage === 0}
            onPress={() => setPage(currentPage - 1)}
            style={styles.arrow}
          >
            <Feather
              name="arrow-left"
              size={sizing.smallIcon}
              color={currentPage === 0 ? colors.muted : colors.ink}
            />
          </Pressable>
          <Text style={styles.count}>
            {currentPage + 1} of {total}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="More choices"
            disabled={currentPage === total - 1}
            onPress={() => setPage(currentPage + 1)}
            style={styles.arrow}
          >
            <Feather
              name="arrow-right"
              size={sizing.smallIcon}
              color={currentPage === total - 1 ? colors.muted : colors.ink}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}
