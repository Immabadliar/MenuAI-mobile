import { useContext } from "react";

import { DietDraftContext } from "@/providers/DietDraftContext";

export function useDietDraft() {
  const context = useContext(DietDraftContext);
  if (!context) throw new Error("DietDraftProvider is missing.");
  return context;
}
