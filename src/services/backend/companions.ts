import type { Services } from "@/services/types";

import { notConnected } from "./notConnected";

export const companions: Services["companions"] = {
  async list() {
    // TODO(backend): list companions owned by the authenticated user.
    return notConnected("companions.list");
  },
  async create(_input) {
    // TODO(backend): create a companion and return its server-generated id.
    return notConnected("companions.create");
  },
  async update(_id, _updates) {
    // TODO(backend): check ownership and merge the companion updates.
    return notConnected("companions.update");
  },
  async remove(_id) {
    // TODO(backend): remove the companion without changing historical scan results.
    notConnected("companions.remove");
  },
};
