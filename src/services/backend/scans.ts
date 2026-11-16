import type { Services } from "@/services/types";

import { notConnected } from "./notConnected";

export const scans: Services["scans"] = {
  async create(_imageUris, _companionIds, _restaurantName) {
    // TODO(backend): upload local images, enforce quota atomically, and queue menu analysis.
    return notConnected("scans.create");
  },
  async list() {
    // TODO(backend): return current user's scans, newest first, including pending and failed scans.
    return notConnected("scans.list");
  },
  async get(_id) {
    // TODO(backend): check ownership and return current processing status and per-person results.
    return notConnected("scans.get");
  },
};
