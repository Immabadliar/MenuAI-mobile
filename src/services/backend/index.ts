import type { Services } from "@/services/types";

import { auth } from "./auth";
import { billing } from "./billing";
import { companions } from "./companions";
import { feedback } from "./feedback";
import { profile } from "./profile";
import { scans } from "./scans";

export const backendServices: Services = {
  auth,
  profile,
  companions,
  scans,
  feedback,
  billing,
};
