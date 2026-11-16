import { dietOptions } from "@/lib/dietOptions";
import type { Services } from "@/services/types";
import type { Companion, DietProfile, PersonResult, Plan, Profile, Scan, Session } from "@/types";

// TODO(backend): mock state is in memory and resets on reload. Persist real account data server-side.
export const mockOptions = {
  simulateErrors: false,
  unreadableMenus: false,
  failedScans: false,
};
const accounts = new Map<
  string,
  {
    profile: Profile | null;
    companions: Companion[];
    scans: Scan[];
    plan: Plan;
    feedback: Map<string, { rating: string; note?: string }>;
  }
>();
let session: Session | null = null;
let nextId = 1;
const listeners = new Set<(value: Session | null) => void>();
const sentCodes = new Map<string, number>();
const emptyDiet = (): DietProfile => ({
  style: [],
  avoid: [],
  limit: {},
  prefer: [],
  allergies: [],
  notes: "",
});
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

async function delay() {
  await new Promise<void>((resolve) => setTimeout(resolve, 600 + Math.random() * 900));
  if (mockOptions.simulateErrors && Math.random() < 0.15) {
    throw new Error("Couldn't connect. Please try again.");
  }
}
function account() {
  if (!session) throw new Error("Please sign in again.");
  const value = accounts.get(session.email);
  if (!value) throw new Error("Account not found.");
  return value;
}
function normalize(email: string) {
  return email.trim().toLowerCase();
}

// TODO(backend): replace keyword matching with your diet parsing endpoint.
function parse(text: string): DietProfile {
  const value = text.toLowerCase();
  const diet = emptyDiet();
  for (const style of dietOptions) {
    if (value.includes(style.toLowerCase())) diet.style.push(style);
  }
  if (/vegan|vegetarian/.test(value)) diet.avoid.push("Meat");
  if (value.includes("vegan")) diet.avoid.push("Dairy", "Eggs");
  if (/gluten.free/.test(value)) diet.avoid.push("Gluten");
  if (value.includes("keto")) diet.avoid.push("Added sugar", "Bread");
  if (/protein/.test(value)) diet.prefer.push("High-protein");
  if (/vegetable/.test(value)) diet.prefer.push("Vegetables");
  const calories = value.match(/(\d{3,4})\s*(?:cal|kcal)/);
  if (calories) diet.limit.calories_per_meal = Number(calories[1]);
  diet.notes = text;
  return diet;
}

// TODO(backend): generate real menu-specific results. These are illustrative fixtures only.
function result(
  person: string,
  name: string,
  diet: DietProfile,
  allergies: string[],
): PersonResult {
  const plantBased = diet.style.some((style) => /vegan|vegetarian/i.test(style));
  const dish = plantBased ? "Roasted vegetable bowl" : "Grilled salmon plate";
  return {
    person,
    personName: name,
    menu_readable: !mockOptions.unreadableMenus,
    top_picks: [
      {
        dish,
        why: `A possible match for ${diet.style.join(", ") || "your preferences"}. Ask about ingredients and preparation${diet.limit.calories_per_meal ? ` and your ${diet.limit.calories_per_meal}-calorie meal target` : ""}.`,
        order_script: `I'd like the ${dish.toLowerCase()}, with dressing on the side.${allergies.length ? ` I have allergies to ${allergies.join(", ")}. Could you confirm the ingredients and cross-contact precautions with the kitchen?` : " Please confirm the ingredients with the kitchen."}`,
        fit: 92,
        confidence: "high",
      },
      {
        dish: "Seasonal garden salad",
        why: "A flexible option. Request the dressing on the side and confirm any substitutions.",
        order_script: `Could I have the garden salad with dressing on the side?${allergies.length ? ` I have allergies to ${allergies.join(", ")}. Please check ingredients and preparation with the kitchen.` : " Please tell me what comes in the dressing."}`,
        fit: 81,
        confidence: "medium",
      },
    ],
    avoid: [
      {
        dish: "Creamy house pasta",
        reason: `May conflict with ${diet.avoid.join(", ") || "your meal preferences"}. Ingredients need confirmation.`,
      },
    ],
    allergy_warnings: allergies.map((allergen) => ({
      dish: "House dressing",
      allergen,
      note: "Ingredients and shared preparation areas need confirmation.",
    })),
  };
}
function seedScan(profile: Profile): Scan {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return {
    id: `demo-${nextId++}`,
    createdAt: yesterday.toISOString(),
    restaurantName: "Sample · Green Table",
    imageUris: [],
    status: "done",
    results: [result("self", profile.displayName || "Me", profile.dietProfile, profile.allergies)],
  };
}

export const mockServices: Services = {
  auth: {
    async sendCode(email) {
      await delay();
      const key = normalize(email);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) throw new Error("Enter a valid email address.");
      const lastSent = sentCodes.get(key);
      if (lastSent && Date.now() - lastSent < 30000)
        throw new Error("Please wait 30 seconds before resending.");
      // TODO(backend): send a real email code. Mock code is 123456 and expires in 10 minutes.
      sentCodes.set(key, Date.now());
    },
    async verifyCode(email, code) {
      await delay();
      const key = normalize(email);
      const sentAt = sentCodes.get(key);
      if (!sentAt || Date.now() - sentAt > 600000 || code !== "123456")
        throw new Error("That code is incorrect or expired. Try again.");
      if (!accounts.has(key))
        accounts.set(key, {
          profile: null,
          companions: [],
          scans: [],
          plan: { plan: "free", scansLeftThisWeek: 3 },
          feedback: new Map(),
        });
      session = { userId: key, email: key };
      sentCodes.delete(key);
      listeners.forEach((listener) => listener(session));
      return { ...session };
    },
    async signOut() {
      await delay();
      session = null;
      listeners.forEach((listener) => listener(null));
    },
    async getSession() {
      await delay();
      return session ? { ...session } : null;
    },
    onAuthChange(cb) {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
  },
  profile: {
    async getProfile() {
      await delay();
      return clone(account().profile);
    },
    async parseDiet(text) {
      await delay();
      if (!text.trim()) throw new Error("Describe how you eat first.");
      return parse(text);
    },
    async saveProfile(updates) {
      await delay();
      const data = account();
      data.profile = {
        id: session!.userId,
        displayName: "Me",
        dietText: "",
        dietProfile: emptyDiet(),
        allergies: [],
        ...data.profile,
        ...clone(updates),
      };
      if (!data.scans.length) data.scans.push(seedScan(data.profile));
      return clone(data.profile);
    },
  },
  companions: {
    async list() {
      await delay();
      return clone(account().companions);
    },
    async create(input) {
      await delay();
      const value = { ...clone(input), id: `person-${nextId++}` };
      account().companions.push(value);
      return clone(value);
    },
    async update(id, input) {
      await delay();
      const data = account();
      const index = data.companions.findIndex((person) => person.id === id);
      if (index < 0) throw new Error("Companion not found.");
      data.companions[index] = { ...data.companions[index], ...clone(input) };
      return clone(data.companions[index]);
    },
    async remove(id) {
      await delay();
      const data = account();
      data.companions = data.companions.filter((person) => person.id !== id);
    },
  },
  scans: {
    async create(imageUris, companionIds, restaurantName) {
      await delay();
      const data = account();
      if (!data.profile) throw new Error("Complete your diet profile first.");
      if (!imageUris.length || imageUris.length > 3)
        throw new Error("Add between one and three menu pages.");
      if (data.plan.scansLeftThisWeek === 0)
        throw new Error("You've used this week's scans. Upgrade to continue.");
      const people = companionIds.map((id) => {
        const person = data.companions.find((value) => value.id === id);
        if (!person) throw new Error("A selected companion no longer exists.");
        return person;
      });
      const scan: Scan = {
        id: `scan-${nextId++}`,
        createdAt: new Date().toISOString(),
        restaurantName,
        imageUris: [...imageUris],
        status: "pending",
        results: [
          result(
            "self",
            data.profile.displayName || "Me",
            data.profile.dietProfile,
            data.profile.allergies,
          ),
          ...people.map((person) =>
            result(person.id, person.name, person.dietProfile, person.allergies),
          ),
        ],
      };
      if (data.plan.scansLeftThisWeek !== null) data.plan.scansLeftThisWeek -= 1;
      data.scans.unshift(scan);
      return clone(scan);
    },
    async list() {
      await delay();
      return clone(account().scans);
    },
    async get(id) {
      await delay();
      const scan = account().scans.find((value) => value.id === id);
      if (!scan) throw new Error("Menu scan not found.");
      if (scan.status === "pending" && Date.now() - new Date(scan.createdAt).getTime() > 2200)
        scan.status = mockOptions.failedScans ? "failed" : "done";
      return clone(scan);
    },
  },
  feedback: {
    async submit(scanId, person, dish, rating, note) {
      await delay();
      const data = account();
      if (!data.scans.some((scan) => scan.id === scanId)) throw new Error("Scan not found.");
      data.feedback.set(`${scanId}:${person}:${dish}`, { rating, note });
    },
    async hasSubmitted(scanId) {
      await delay();
      return [...account().feedback.keys()].some((key) => key.startsWith(`${scanId}:`));
    },
  },
  billing: {
    async getPlan() {
      await delay();
      return clone(account().plan);
    },
    // TODO(backend): verify a real store purchase and entitlement on the server.
    async purchasePlus(_period) {
      await delay();
      account().plan = { plan: "plus", scansLeftThisWeek: null };
      return clone(account().plan);
    },
  },
};
