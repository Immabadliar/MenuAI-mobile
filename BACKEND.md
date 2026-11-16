# Backend handoff

The app runs against in-memory mock services. Mock email verification uses `123456`. Mock state resets when the JavaScript runtime reloads. Images stay on the device, and scan results are sample fixtures rather than analysis of the uploaded photo.

## Start coding

Implement the typed adapters in `src/services/backend/`. Each file corresponds to one Services area. Unimplemented methods deliberately throw an informative error.

When the adapter is ready, change only `src/services/index.ts` to select it.

```ts
import { backendServices } from "@/services/backend";
import type { Services } from "@/services/types";

export const services: Services = backendServices;
```

Screens import `services` from `@/services`. They never import the mock implementation. The contract in `src/services/types.ts` is preserved. Shared data models live in `src/types.ts`.

## Service contract

| Function                | Inputs                                                                          | Result and expectations                                                                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `auth.sendCode`         | email string                                                                    | `Promise<void>`. Send a short-lived code. Reject invalid addresses and rate-limited requests with a readable Error.                                                                                    |
| `auth.verifyCode`       | email, 6-digit code                                                             | `Promise<Session>`. Verify the code and publish the new session to listeners. Session contains `userId` and `email`.                                                                                   |
| `auth.signOut`          | none                                                                            | `Promise<void>`. Revoke credentials and notify listeners with null.                                                                                                                                    |
| `auth.getSession`       | none                                                                            | `Promise<Session \| null>`. Restore or refresh the current session.                                                                                                                                    |
| `auth.onAuthChange`     | callback receiving Session or null                                              | Synchronous unsubscribe function. Publish sign-in, expiry, and sign-out events.                                                                                                                        |
| `profile.getProfile`    | none                                                                            | `Promise<Profile \| null>`. Null indicates a new account requiring onboarding.                                                                                                                         |
| `profile.parseDiet`     | free-form diet text                                                             | `Promise<DietProfile>`. Return style, avoid, prefer, allergies, notes, and optional calorie limit. The separately answered allergy question overrides parsed allergies before saving.                  |
| `profile.saveProfile`   | `Partial<Profile>`                                                              | `Promise<Profile>`. Merge updates. A name-only edit must preserve diet and allergy data.                                                                                                               |
| `companions.list`       | none                                                                            | `Promise<Companion[]>`. Return only companions owned by the current account.                                                                                                                           |
| `companions.create`     | name, dietText, dietProfile, allergies                                          | `Promise<Companion>`. Assign the id on the server.                                                                                                                                                     |
| `companions.update`     | id, partial companion input                                                     | `Promise<Companion>`. Check ownership and return the updated record.                                                                                                                                   |
| `companions.remove`     | companion id                                                                    | `Promise<void>`. Keep historical scan snapshots intact.                                                                                                                                                |
| `scans.create`          | 1–3 local image URIs, companion ids, optional restaurant name                   | `Promise<Scan>`. Upload image bytes, check quota atomically, and create a processing job. The client resizes long edges to at most 1500 px first. Local file URIs cannot be read directly by a server. |
| `scans.list`            | none                                                                            | `Promise<Scan[]>`. Newest first, with id, ISO createdAt, optional restaurant, thumbnails, status, and results.                                                                                         |
| `scans.get`             | scan id                                                                         | `Promise<Scan>`. Check ownership. Results polls this method while status is pending and stops on done, failed, error, or unmount.                                                                      |
| `feedback.submit`       | scan id, person id (`self` or companion id), dish, good/okay/bad, optional note | `Promise<void>`. Upsert by user/scan/person/dish so retries do not duplicate feedback.                                                                                                                 |
| `feedback.hasSubmitted` | scan id                                                                         | `Promise<boolean>`. Persist feedback completion so yesterday's prompt is shown once across sessions.                                                                                                   |
| `billing.getPlan`       | none                                                                            | `Promise<Plan>`. Free returns an integer weekly quota. Plus returns null for scansLeftThisWeek.                                                                                                        |
| `billing.purchasePlus`  | monthly or yearly                                                               | `Promise<Plan>`. Initiate and verify a real store purchase, then return the entitlement. The mock only changes the plan.                                                                               |

## Authentication decisions to wire

The existing login/signup UI retains password fields, shown one at a time. The supplied Services contract authenticates with an email code, so the frontend validates these fields and then sends a code. Passwords are never sent to the mock or persisted. Implement password authentication at the marked hook location if you want to keep it in production, or use the existing email-code route as your entry point.

Google appears only on the initial login/signup choice screen. Its button currently displays a clear inline notice. Add Google OAuth to the auth adapter before enabling real sign-in.

Account deletion opens a confirmation dialog. The supplied contract has no deletion method, so the confirmed action displays a demo notice. Add an authenticated deletion method, remove account data server-side, then clear the session.

The frontend labels mock purchases and example scan results. Replace these demo notices when real endpoints are active.

## Errors, retries, and persistence

Services reject with `Error` objects whose messages can be displayed inline. Auth changes must invalidate cached account data. Enforce ownership, image limits, quota resets, code expiry, and receipt verification on the server.

The mock supports optional simulated network errors, unreadable menus, and failed scans through `mockOptions`. Default error simulation is off. Calls delay 600–1500 ms. A sample previous-day scan demonstrates history feedback. Normal scans begin pending and resolve when polled.

Feedback is submitted only for dishes the user rates. Real feedback writes should be idempotent, including retries after a partially completed multi-dish submission.

Never infer allergy absence from a fit score. Every allergy warning must retain the required instruction to confirm with the server. Keep the exact disclaimer in `src/theme/index.ts`.

## Backend TODO locations

- `src/screens/Login/useLogin.ts:43` — connect Google OAuth through the auth service.
- `src/screens/Login/useLogin.ts:73` — wire password-based login/signup here if retaining password auth.
- `src/screens/Settings/useSettings.ts:73` — add an authenticated account deletion service and call it here, then clear the session.
- `src/services/backend/auth.ts:7` — request a short-lived email code, with server-side rate limiting.
- `src/services/backend/auth.ts:11` — verify the code, store the session, and notify auth listeners.
- `src/services/backend/auth.ts:15` — revoke the session, clear local credentials, and notify listeners.
- `src/services/backend/auth.ts:19` — restore and refresh the authenticated session.
- `src/services/backend/auth.ts:23` — subscribe to session changes and return an unsubscribe function.
- `src/services/backend/auth.ts:28` — connect Google OAuth through the auth service.
- `src/services/backend/billing.ts:7` — fetch verified entitlements and the remaining weekly scan quota.
- `src/services/backend/billing.ts:11` — initiate a store purchase, verify the receipt, and return the entitlement.
- `src/services/backend/companions.ts:7` — list companions owned by the authenticated user.
- `src/services/backend/companions.ts:11` — create a companion and return its server-generated id.
- `src/services/backend/companions.ts:15` — check ownership and merge the companion updates.
- `src/services/backend/companions.ts:19` — remove the companion without changing historical scan results.
- `src/services/backend/feedback.ts:7` — upsert feedback by account, scan, person, and dish for retry protection.
- `src/services/backend/feedback.ts:11` — return whether feedback has already been submitted for this scan.
- `src/services/backend/profile.ts:7` — fetch the current user's profile, or null before onboarding.
- `src/services/backend/profile.ts:11` — parse free text into a DietProfile without dropping the original notes.
- `src/services/backend/profile.ts:15` — merge partial updates, synchronize allergies, and return the saved profile.
- `src/services/backend/scans.ts:7` — upload local images, enforce quota atomically, and queue menu analysis.
- `src/services/backend/scans.ts:11` — return current user's scans, newest first, including pending and failed scans.
- `src/services/backend/scans.ts:15` — check ownership and return current processing status and per-person results.
- `src/services/index.ts:4` — replace this import and implementation with your real Services adapter.
- `src/services/mock/index.ts:5` — mock state is in memory and resets on reload. Persist real account data server-side.
- `src/services/mock/index.ts:51` — replace keyword matching with your diet parsing endpoint.
- `src/services/mock/index.ts:70` — generate real menu-specific results. These are illustrative fixtures only.
- `src/services/mock/index.ts:134` — send a real email code. Mock code is 123456 and expires in 10 minutes.
- `src/services/mock/index.ts:289` — verify a real store purchase and entitlement on the server.
- `src/services/types.ts:48` — persist feedback status so history prompts stay dismissed across sessions.
