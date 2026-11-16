import { router } from "expo-router";

import { Button, EmptyState, ErrorState, Heading, Loading, Screen } from "@/ui";

import { Editor } from "./CompanionEditor";
import { useCompanion } from "./useCompanion";

export default function CompanionScreen() {
  const { id, data, loading, error, reload } = useCompanion();
  return (
    <Screen>
      <Button title="Back" variant="text" onPress={() => router.back()} />
      <Heading title={id === "new" ? "Add companion" : "Edit companion"} />
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} retry={() => void reload()} />
      ) : data === undefined ? (
        <EmptyState title="Companion not found" message="This person may have been removed." />
      ) : (
        <Editor key={id} companion={data} />
      )}
    </Screen>
  );
}
