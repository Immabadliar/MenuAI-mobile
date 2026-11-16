# MenuAI design system

## Current direction

The latest visual direction is Apple's Liquid Glass, based on the user's Control Center and translucent dashboard references. The earlier editorial styling has been replaced by live gradient light, backdrop refraction,, restrained sans-serif typography, rounded glass controls, and blue selected states.

The web preview uses live CSS backdrop blur, SVG displacement of the real backdrop where supported, and edge highlights. The ambient backdrop is rendered from gradients with a reduced-motion-aware light band. There is no wallpaper or baked glass image. Each route owns its backdrop so navigation backgrounds cannot cover it. Native iOS glass uses the already-installed `expo-glass-effect`. Both availability checks run before a GlassView is created. On unsupported platforms, the component renders a translucent surface. Web adds backdrop blur. Reduce Transparency switches native surfaces to a more opaque material. Native refraction requires a supported iPhone build and iOS 26 or later.

Public Hinge and Noom examples in [Mobbin's onboarding study](https://mobbin.com/blog/the-long-onboarding-a-study-of-1-460-flows) informed the question hierarchy, visible progress, and anchored actions. The user's [Liquid Glass guide](https://0xminds.com/blog/guides/liquid-glass-ui-prompts-ai-tailwind-guide) informed the tint, edge highlight, and depth treatment. App screenshots were inspected as references and are not bundled into the app.

## Tokens

All visual values belong in `src/theme/`. Use semantic names instead of embedding colors and measurements in components.

| Token                           | Value and use                                             |
| ------------------------------- | --------------------------------------------------------- |
| background                      | `#E4EDF1`, cool backdrop fallback                         |
| ink                             | `#172630`, primary text                                   |
| muted                           | `#4E606B`, supporting text                                |
| accent                          | `#005BC4`, primary actions and selected states            |
| glass                           | translucent white, standard material                      |
| glassStrong                     | higher-opacity white, legibility and reduced transparency |
| glassEdge                       | white highlight around glass                              |
| warningBackground / warningText | `#FFF2CF` / `#754414`, allergy messages                   |
| olive / amber / stone           | fit bars, paired with text labels                         |
| space                           | 4, 8, 12, 16, 24, 32, 48                                  |
| radius                          | 20 for compact controls, 28 for surfaces, 999 for pills   |
| sizing                          | buttons 48, inputs 56, minimum targets 44, icons 20–22    |
| motion                          | scale 0.98 on press, 280 ms entry, 40 ms stagger          |

`colors.ts` contains color values. `index.ts` exports spacing, sizing, type, radii, motion, and disclaimer tokens. `glass.ts` contains backdrop and material settings.

## Typography

DM Sans regular and medium load before the splash screen hides. Titles use a 34 px / 44 px line height. Compact titles and order scripts use 28 / 36. Body and labels use 16 / 21. Secondary text uses 14 / 20. Section labels use 13 / 20 with restrained letter spacing.

Use a clear sentence as the screen title. Avoid extra taglines, decorative numbers, repeated introductory copy, and oversized section headings. Text scaling remains enabled.

## Components

| Component      | Use                                                                    |
| -------------- | ---------------------------------------------------------------------- |
| GlassBackdrop  | One live gradient backdrop behind each route                           |
| GlassSurface   | Shared native/fallback material for buttons, cards, and fields         |
| Screen         | Safe area, keyboard handling, padding, and optional scrolling          |
| Button         | Primary, outline, or text actions, with disabled and loading states    |
| TextField      | Labelled glass input, focus edge, inline error                         |
| Chip           | Toggleable pill with selection haptic and selected state               |
| Card           | Related content in a glass surface                                     |
| Badge          | Quiet textual confidence label with a semantic color                   |
| Heading        | Screen heading or small section heading                                |
| Loading        | Reduced-motion-aware skeleton placeholders                             |
| EmptyState     | One sentence, one supporting line, one optional action                 |
| ErrorState     | Inline message, warning haptic, optional retry                         |
| OnboardingStep | Fixed question frame with progress, Back, and bottom Continue          |
| PagedChoices   | Wrapping choices with explicit Next/Previous controls on small screens |
| PickCard       | Dish, short rationale, fit bar, confidence, and order action           |
| FeedbackForm   | Ratings only for dishes actually ordered                               |

Feather is the UI icon set. Google uses its official logo asset on the provider button.

## Layout and behavior rules

- Keep routes thin. Screens live in `src/screens/<Name>/`, with their own styles and private components.
- Use `@/` for imports from src. Keep the protected Services interface intact.
- Use StyleSheet for styles. Keep shared visual values in theme files. Reanimated styles handle changing animation values.
- Group React/React Native imports, third-party imports, alias imports, and local imports.
- Keep components around 150 lines or less. Move state and handlers into named hooks.
- Login and onboarding have no ScrollView. Login advances through individual fields so the keyboard does not cover other inputs.
- Google appears on the initial login/signup choice screen and disappears during form entry.
- Onboarding asks one question per step. Long option groups paginate rather than scrolling.
- Keep glass below text and controls. Do not animate native glass to near-zero opacity.
- Show fit numbers as well as colored bars. Keep confidence labels explicit.
- Preserve the exact allergy disclaimer. Warnings always say “May contain … Confirm with your server.”
- Respect Reduce Motion and Reduce Transparency. Keep icon-only targets at least 44 and label them.
- Loading, empty, and error states are part of each data flow. Never imply that mock Google auth, payments, or deletion completed.

## Commands

`npm run format` applies the project's double-quote, semicolon, trailing-comma, 100-column format. `npm run typecheck` checks strict TypeScript. `npm run lint` checks Expo, unused variables, explicit any, and formatting rules.

## Screen changes

- Welcome uses a short headline and an anchored glass action panel.
- Login keeps Google on the choice screen, then shows one field at a time with an inline password visibility control.
- Code entry uses the same fixed layout, with resend cooldown and inline errors.
- Diet and review ask one question per screen. The 34 diet choices support search and pagination on short screens or at larger text sizes.
- Scan uses a camera frame, animated page thumbnails, companion selection, and a floating glass tab bar.
- Results use per-person pills, glass dish surfaces, fit bars, quiet confidence labels, and distinct allergy notices.
- The order modal keeps the script large and selectable, with working Copy and Done controls.
- History, settings, companions, and paywall reuse the material, typography, and state components.

## Verification

TypeScript, lint, and formatting checks pass. Browser checks cover the live blur/refraction, Google visibility, 320×568 login and onboarding layouts, email-code auth, profile gate, companion creation, image import, whole-table results, allergy wording, and copying an order. Mock checks cover quota concurrency and failure states. Native bundles compile. Native glass appearance and real camera capture still require a device check.
