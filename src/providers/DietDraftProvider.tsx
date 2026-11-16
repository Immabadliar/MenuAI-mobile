import { useState, type PropsWithChildren } from "react";

import { DietDraftContext, type DietDraft } from "./DietDraftContext";

export function DietDraftProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<DietDraft | null>(null);
  return (
    <DietDraftContext.Provider value={{ draft, setDraft }}>{children}</DietDraftContext.Provider>
  );
}
