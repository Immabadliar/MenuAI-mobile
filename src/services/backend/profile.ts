import type { Services } from "@/services/types";

import { notConnected } from "./notConnected";

export const profile: Services["profile"] = {
  async getProfile() {
    // TODO(backend): fetch the current user's profile, or null before onboarding.
    return notConnected("profile.getProfile");
  },
  async parseDiet(_text) {
    // TODO(backend): parse free text into a DietProfile without dropping the original notes.
    return notConnected("profile.parseDiet");
  },
  async saveProfile(_updates) {
    // TODO(backend): merge partial updates, synchronize allergies, and return the saved profile.
    return notConnected("profile.saveProfile");
  },
};
