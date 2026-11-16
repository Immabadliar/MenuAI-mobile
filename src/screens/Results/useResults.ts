import { useCallback, useEffect, useRef, useState } from "react";

import { useLocalSearchParams } from "expo-router";

import { useResource } from "@/hooks/useResource";
import { haptics } from "@/lib/haptics";
import { services } from "@/services";

export function useResults() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const load = useCallback(() => services.scans.get(id), [id]);
  const { data: scan, loading, error, reload } = useResource(load);
  const lastCompleted = useRef("");
  useEffect(() => {
    if (scan?.status === "done" && lastCompleted.current !== scan.id) {
      lastCompleted.current = scan.id;
      haptics.success();
    }
  }, [scan]);
  const [personId, setPersonId] = useState("self");
  useEffect(() => {
    if (scan?.status !== "pending" || error || loading) return;
    const timer = setTimeout(() => void reload(), 1500);
    return () => clearTimeout(timer);
  }, [scan, error, loading, reload]);
  const person = scan?.results.find((value) => value.person === personId) ?? scan?.results[0];
  return { id, scan, loading, error, reload, setPersonId, person };
}
