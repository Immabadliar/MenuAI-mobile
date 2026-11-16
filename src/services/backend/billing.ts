import type { Services } from "@/services/types";

import { notConnected } from "./notConnected";

export const billing: Services["billing"] = {
  async getPlan() {
    // TODO(backend): fetch verified entitlements and the remaining weekly scan quota.
    return notConnected("billing.getPlan");
  },
  async purchasePlus(_period) {
    // TODO(backend): initiate a store purchase, verify the receipt, and return the entitlement.
    return notConnected("billing.purchasePlus");
  },
};
