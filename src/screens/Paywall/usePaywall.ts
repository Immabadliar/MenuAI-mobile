import { useState } from "react";

import { errorMessage, useResource } from "@/hooks/useResource";
import { services } from "@/services";

const load = () => services.billing.getPlan();

export function usePaywall() {
  const resource = useResource(load);
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [purchased, setPurchased] = useState(false);
  async function purchase() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await services.billing.purchasePlus(period);
      setPurchased(true);
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setLoading(false);
    }
  }
  return { resource, period, setPeriod, loading, error, purchased, purchase };
}
