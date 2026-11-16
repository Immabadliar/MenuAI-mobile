import type { Services } from "@/services/types";

import { notConnected } from "./notConnected";

export const auth: Services["auth"] = {
  async sendCode(_email) {
    // TODO(backend): request a short-lived email code, with server-side rate limiting.
    notConnected("auth.sendCode");
  },
  async verifyCode(_email, _code) {
    // TODO(backend): verify the code, store the session, and notify auth listeners.
    return notConnected("auth.verifyCode");
  },
  async signOut() {
    // TODO(backend): revoke the session, clear local credentials, and notify listeners.
    notConnected("auth.signOut");
  },
  async getSession() {
    // TODO(backend): restore and refresh the authenticated session.
    return notConnected("auth.getSession");
  },
  onAuthChange(_callback) {
    // TODO(backend): subscribe to session changes and return an unsubscribe function.
    return notConnected("auth.onAuthChange");
  },
};

// TODO(backend): connect Google OAuth through the auth service.
