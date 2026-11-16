import { ScrollView, Text } from "react-native";

import { router } from "expo-router";

import { disclaimer, typography } from "@/theme";
import { Button, Chip, EmptyState, ErrorState, Heading, Loading, Screen } from "@/ui";

import { PersonPicks } from "./PersonPicks";
import { styles } from "./Results.styles";
import { useResults } from "./useResults";

export default function ResultsScreen() {
  const { scan, loading, error, reload, setPersonId, person } = useResults();
  return (
    <Screen>
      <Button title="Back to scan" variant="text" onPress={() => router.replace("/(tabs)/scan")} />
      <Heading title={scan?.restaurantName || "Your menu picks"} />
      <Text style={typography.caption}>{disclaimer}</Text>
      {error ? (
        <ErrorState message={error} retry={() => void reload()} />
      ) : loading || scan?.status === "pending" ? (
        <Loading message="Reading the menu…" />
      ) : scan?.status === "failed" ? (
        <ErrorState
          message="Couldn't read that one. Try a closer, brighter photo."
          retry={() => router.replace("/(tabs)/scan")}
        />
      ) : !scan || !person ? (
        <EmptyState
          title="Your picks will be here."
          message="Add a menu photo to get started."
          action={{ title: "Scan menu", onPress: () => router.replace("/(tabs)/scan") }}
        />
      ) : (
        <>
          <ScrollView
            horizontal
            bounces={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabs}
          >
            {scan.results.map((value) => (
              <Chip
                key={value.person}
                label={value.personName}
                selected={person.person === value.person}
                onPress={() => setPersonId(value.person)}
              />
            ))}
          </ScrollView>
          <PersonPicks person={person} scanId={scan.id} />
        </>
      )}
    </Screen>
  );
}
