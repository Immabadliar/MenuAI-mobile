export type DietProfile = {
  style: string[];
  avoid: string[];
  limit: { calories_per_meal?: number };
  prefer: string[];
  allergies: string[];
  notes: string;
};
export type Profile = {
  id: string;
  displayName: string;
  dietText: string;
  dietProfile: DietProfile;
  allergies: string[];
};
export type Companion = {
  id: string;
  name: string;
  dietText: string;
  dietProfile: DietProfile;
  allergies: string[];
};
export type Pick = {
  dish: string;
  why: string;
  order_script: string;
  fit: number;
  confidence: "high" | "medium" | "low";
};
export type PersonResult = {
  person: string;
  personName: string;
  top_picks: Pick[];
  avoid: { dish: string; reason: string }[];
  allergy_warnings: { dish: string; allergen: string; note: string }[];
  menu_readable: boolean;
};
export type Scan = {
  id: string;
  createdAt: string;
  restaurantName?: string;
  imageUris: string[];
  status: "pending" | "done" | "failed";
  results: PersonResult[];
};
export type Plan = { plan: "free" | "plus"; scansLeftThisWeek: number | null };
export type Session = { userId: string; email: string };
export type Rating = "good" | "okay" | "bad";
export type CompanionInput = Omit<Companion, "id">;

export type MenuPage = {
  uri: string;
  width: number;
  height: number;
};
