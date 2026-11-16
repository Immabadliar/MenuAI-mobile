import type { Services } from "@/services/types";

import { notConnected } from "./notConnected";

export const feedback: Services["feedback"] = {
  async submit(_scanId, _person, _dish, _rating, _note) {
    // TODO(backend): upsert feedback by account, scan, person, and dish for retry protection.
    notConnected("feedback.submit");
  },
  async hasSubmitted(_scanId) {
    // TODO(backend): return whether feedback has already been submitted for this scan.
    return notConnected("feedback.hasSubmitted");
  },
};
