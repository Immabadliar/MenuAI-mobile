import { useCallback } from "react";

import { useLocalSearchParams } from "expo-router";

import { useResource } from "@/hooks/useResource";
import { services } from "@/services";

export function useCompanion() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const load = useCallback(
    async () =>
      id === "new"
        ? null
        : ((await services.companions.list()).find((person) => person.id === id) ?? undefined),
    [id],
  );
  const { data, loading, error, reload } = useResource(load);
  return { id, data, loading, error, reload };
}
