import { createContext } from "react";

import type { DietProfile } from "@/types";

export type DietDraft = { text: string; allergies: string[]; parsed: DietProfile };
export const DietDraftContext = createContext<{
  draft: DietDraft | null;
  setDraft: (draft: DietDraft | null) => void;
} | null>(null);
