import { useState } from "react";
import { Text, View } from "react-native";

import { errorMessage } from "@/hooks/useResource";
import { services } from "@/services";
import { typography } from "@/theme";
import type { Rating, Scan } from "@/types";

import { Button, Card, Chip, ErrorState, TextField, layout } from ".";

export function FeedbackForm({ scan, onDone }: { scan: Scan; onDone: () => void }) {
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dishes = scan.results.flatMap((person) =>
    person.top_picks.map((pick) => ({
      person: person.person,
      name: person.personName,
      dish: pick.dish,
    })),
  );
  async function submit() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await Promise.all(
        dishes
          .filter((item) => ratings[`${item.person}:${item.dish}`])
          .map((item) =>
            services.feedback.submit(
              scan.id,
              item.person,
              item.dish,
              ratings[`${item.person}:${item.dish}`],
              note.trim() || undefined,
            ),
          ),
      );
      onDone();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card>
      <Text style={typography.heading}>How was it?</Text>
      <Text style={typography.caption}>
        Rate only the dishes you ordered at {scan.restaurantName || "your last restaurant"}.
      </Text>
      {dishes.map((item) => (
        <View key={`${item.person}:${item.dish}`} style={layout.stack}>
          <Text style={typography.body}>
            {item.name} · {item.dish}
          </Text>
          <View style={layout.row}>
            {(["good", "okay", "bad"] as const).map((rating) => (
              <Chip
                key={rating}
                label={rating}
                selected={ratings[`${item.person}:${item.dish}`] === rating}
                onPress={() =>
                  setRatings((current) => ({
                    ...current,
                    [`${item.person}:${item.dish}`]: rating,
                  }))
                }
              />
            ))}
          </View>
        </View>
      ))}
      <TextField label="Anything to add? (optional)" value={note} onChangeText={setNote} />
      {error !== "" && <ErrorState message={error} />}
      <Button
        title="Send feedback"
        disabled={!Object.keys(ratings).length}
        loading={loading}
        onPress={() => void submit()}
      />
    </Card>
  );
}
