import { createContext } from "react";

import type { Profile, Session } from "@/types";

export type AuthState = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isInitialized: boolean;
  error: string;
  refresh: () => Promise<void>;
};
export const AuthContext = createContext<AuthState | null>(null);
