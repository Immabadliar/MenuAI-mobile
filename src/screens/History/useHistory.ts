import { useCallback, useState } from "react";

import { useFocusEffect } from "expo-router";

import { useResource } from "@/hooks/useResource";
import { services } from "@/services";

function isYesterday(value: string) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return new Date(value).toDateString() === yesterday.toDateString();
}
async function load() {
  const scans = await services.scans.list();
  const recent = scans.filter((scan) => scan.status === "done" && isYesterday(scan.createdAt));
  const statuses = await Promise.all(
    recent.map(async (scan) => ({
      scan,
      submitted: await services.feedback.hasSubmitted(scan.id),
    })),
  );
  return {
    scans,
    prompts: statuses.filter((value) => !value.submitted).map((value) => value.scan),
  };
}

export function useHistory() {
  const resource = useResource(load);
  const [completed, setCompleted] = useState<string[]>([]);
  const { reload } = resource;
  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );
  return { resource, completed, setCompleted };
}
