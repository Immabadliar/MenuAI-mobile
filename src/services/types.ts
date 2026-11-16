import type {
  Companion,
  CompanionInput,
  DietProfile,
  Plan,
  Profile,
  Rating,
  Scan,
  Session,
} from "../types";

export interface Services {
  auth: {
    sendCode(email: string): Promise<void>;
    verifyCode(email: string, code: string): Promise<Session>;
    signOut(): Promise<void>;
    getSession(): Promise<Session | null>;
    onAuthChange(cb: (session: Session | null) => void): () => void;
  };
  profile: {
    getProfile(): Promise<Profile | null>;
    parseDiet(text: string): Promise<DietProfile>;
    saveProfile(profile: Partial<Profile>): Promise<Profile>;
  };
  companions: {
    list(): Promise<Companion[]>;
    create(companion: CompanionInput): Promise<Companion>;
    update(id: string, companion: Partial<CompanionInput>): Promise<Companion>;
    remove(id: string): Promise<void>;
  };
  scans: {
    create(
      imageUris: string[],
      companionIds: string[],
      restaurantName?: string,
    ): Promise<Scan>;
    list(): Promise<Scan[]>;
    get(id: string): Promise<Scan>;
  };
  feedback: {
    submit(
      scanId: string,
      person: string,
      dish: string,
      rating: Rating,
      note?: string,
    ): Promise<void>;
    // TODO(backend): persist feedback status so history prompts stay dismissed across sessions.
    hasSubmitted(scanId: string): Promise<boolean>;
  };
  billing: {
    getPlan(): Promise<Plan>;
    purchasePlus(period: "monthly" | "yearly"): Promise<Plan>;
  };
}
