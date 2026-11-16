import { useCallback, useState } from "react";

import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";

import { errorMessage, useResource } from "@/hooks/useResource";
import { services } from "@/services";

export function useOrder() {
  const { id, person, dish } = useLocalSearchParams<{
    id: string;
    person: string;
    dish: string;
  }>();
  const load = useCallback(() => services.scans.get(id), [id]);
  const { data, loading, error, reload } = useResource(load);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const pick =
    data?.status === "done"
      ? data.results
          .find((value) => value.person === person)
          ?.top_picks.find((value) => value.dish === dish)
      : undefined;
  async function copy() {
    if (!pick) return;
    try {
      await Clipboard.setStringAsync(pick.order_script);
      setCopied(true);
      setCopyError("");
    } catch (failure) {
      setCopyError(errorMessage(failure));
    }
  }
  return { dish, loading, error, reload, copied, copyError, pick, copy };
}
