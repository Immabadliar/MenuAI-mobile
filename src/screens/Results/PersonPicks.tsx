import { Text, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

import { colors, sizing, typography } from "@/theme";
import type { PersonResult } from "@/types";
import { EmptyState, Heading } from "@/ui";

import { PickCard } from "./PickCard";
import { styles } from "./Results.styles";

export function PersonPicks({ person, scanId }: { person: PersonResult; scanId: string }) {
  if (!person.menu_readable)
    return (
      <EmptyState
        title="We couldn't read this menu"
        message="Try a closer, brighter photo."
        action={{ title: "Retake menu", onPress: () => router.replace("/(tabs)/scan") }}
      />
    );
  return (
    <>
      {person.allergy_warnings.map((warning, index) => (
        <View key={`${warning.dish}-${warning.allergen}-${index}`} style={styles.warning}>
          <View style={styles.warningHeading}>
            <Feather name="alert-triangle" size={sizing.icon} color={colors.warningText} />
            <Text style={styles.warningText}>{warning.dish}</Text>
          </View>
          <Text style={styles.warningText}>
            May contain {warning.allergen}. Confirm with your server.
          </Text>
          <Text style={styles.warningNote}>{warning.note}</Text>
        </View>
      ))}
      <Heading level="section" title={`Picks for ${person.personName}`} />
      {person.top_picks.length === 0 && (
        <EmptyState
          title="No close matches here."
          message="Ask your server about substitutions, or try another menu."
        />
      )}
      {person.top_picks.map((pick, index) => (
        <PickCard
          key={pick.dish}
          pick={pick}
          index={index}
          scanId={scanId}
          personId={person.person}
        />
      ))}
      <Text style={typography.section}>Dishes to avoid</Text>
      {person.avoid.length === 0 ? (
        <Text style={typography.caption}>
          No dishes flagged. Check ingredients with your server.
        </Text>
      ) : (
        person.avoid.map((item) => (
          <View key={item.dish} style={styles.avoid}>
            <Text style={typography.label}>{item.dish}</Text>
            <Text style={typography.caption}>{item.reason}</Text>
          </View>
        ))
      )}
    </>
  );
}
