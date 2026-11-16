import { useState } from "react";
import { Alert } from "react-native";

import { router } from "expo-router";

import { errorMessage } from "@/hooks/useResource";
import { services } from "@/services";
import type { Companion } from "@/types";
import { Button, ErrorState, TextField } from "@/ui";
import { AllergyQuestion, commonAllergies, splitAllergies } from "@/ui/AllergyQuestion";

export function Editor({ companion }: { companion: Companion | null }) {
  const [name, setName] = useState(companion?.name ?? "");
  const [text, setText] = useState(companion?.dietText ?? "");
  const [allergies, setAllergies] = useState(
    companion?.allergies.filter((value) => commonAllergies.includes(value)) ?? [],
  );
  const [other, setOther] = useState(
    companion?.allergies.filter((value) => !commonAllergies.includes(value)).join(", ") ?? "",
  );
  const [none, setNone] = useState(!!companion && !companion.allergies.length);
  const [busy, setBusy] = useState<"save" | "delete" | null>(null);
  const [error, setError] = useState("");
  async function save() {
    if (busy) return;
    const selected = [...new Set([...allergies, ...splitAllergies(other)])];
    if (!name.trim() || !text.trim()) {
      setError("Enter a name and diet description.");
      return;
    }
    if (!none && !selected.length) {
      setError("Answer the allergy question or choose None.");
      return;
    }
    setBusy("save");
    setError("");
    try {
      const parsed = await services.profile.parseDiet(text.trim());
      const input = {
        name: name.trim(),
        dietText: text.trim(),
        dietProfile: { ...parsed, allergies: selected },
        allergies: selected,
      };
      if (companion) await services.companions.update(companion.id, input);
      else await services.companions.create(input);
      router.back();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(null);
    }
  }
  async function remove() {
    if (!companion || busy) return;
    setBusy("delete");
    setError("");
    try {
      await services.companions.remove(companion.id);
      router.back();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(null);
    }
  }
  return (
    <>
      <TextField label="Name" value={name} onChangeText={setName} editable={!busy} />
      <TextField
        label="How do they eat?"
        multiline
        value={text}
        onChangeText={setText}
        editable={!busy}
      />
      <AllergyQuestion
        selected={allergies}
        onChange={setAllergies}
        other={other}
        onOtherChange={setOther}
        none={none}
        onNoneChange={setNone}
      />
      {error !== "" && <ErrorState message={error} />}
      <Button
        title="Save companion"
        loading={busy === "save"}
        disabled={!!busy}
        onPress={() => void save()}
      />
      {companion && (
        <Button
          title="Remove companion"
          variant="text"
          loading={busy === "delete"}
          disabled={!!busy}
          onPress={() =>
            Alert.alert("Remove companion?", `Remove ${companion.name} from your account?`, [
              { text: "Cancel", style: "cancel" },
              {
                text: "Remove",
                style: "destructive",
                onPress: () => void remove(),
              },
            ])
          }
        />
      )}
    </>
  );
}
