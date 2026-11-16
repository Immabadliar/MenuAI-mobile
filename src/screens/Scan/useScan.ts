import { useCallback, useState } from "react";

import { router, useFocusEffect, useIsFocused } from "expo-router";

import { useMenuPages } from "@/hooks/useMenuPages";
import { errorMessage, useResource } from "@/hooks/useResource";
import { resizeMenuImage } from "@/lib/resizeMenuImage";
import { services } from "@/services";

async function load() {
  const [companions, plan] = await Promise.all([
    services.companions.list(),
    services.billing.getPlan(),
  ]);
  return { companions, plan };
}

export function useScan() {
  const menu = useMenuPages();
  const isFocused = useIsFocused();
  const [selected, setSelected] = useState<string[]>([]);
  const [restaurant, setRestaurant] = useState("");
  const resource = useResource(load);
  const { reload } = resource;
  const { setIsReady } = menu;

  useFocusEffect(
    useCallback(() => {
      setIsReady(false);
      void reload();
    }, [reload, setIsReady]),
  );

  async function handleScan() {
    if (!menu.pages.length || !resource.data) return;
    if (resource.data.plan.scansLeftThisWeek === 0) {
      router.push("/paywall");
      return;
    }
    if (!menu.beginOperation()) return;
    menu.setBusy("scan");
    menu.setError("");
    try {
      const imageUris = await Promise.all(menu.pages.map(resizeMenuImage));
      const companionIds = selected.filter((id) =>
        resource.data?.companions.some((person) => person.id === id),
      );
      const scan = await services.scans.create(
        imageUris,
        companionIds,
        restaurant.trim() || undefined,
      );
      menu.setPages([]);
      router.push({ pathname: "/scan/[id]", params: { id: scan.id } });
    } catch (failure) {
      menu.setError(errorMessage(failure));
    } finally {
      menu.finishOperation();
    }
  }

  function handleTogglePerson(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  return {
    ...menu,
    isFocused,
    selected,
    restaurant,
    setRestaurant,
    resource,
    handleScan,
    handleTogglePerson,
  };
}
