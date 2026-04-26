---
name: Scoped style changes only
description: Font, color, typography, and styling changes must be applied only to the specific page/component requested, never globally
type: preference
---
When the user requests a change to font, color, typography, spacing, or any styling on a specific page or component, apply the change ONLY to that page/component. Do NOT propagate the change to other pages, shared components, global CSS tokens (index.css), or tailwind.config.ts unless the user explicitly says "everywhere", "all pages", "globally", or names multiple pages.

**Why:** The user has corrected this behavior — they want page-level visual control, not site-wide changes from a single request.

**How to apply:**
- Edit only the specific page file (e.g. src/pages/Cart.tsx) with inline classes or local styles.
- Do NOT touch src/index.css, tailwind.config.ts, or shared components in src/components/ui/ for one-off page styling requests.
- If a change would require editing a shared component, ask the user first whether to scope it locally or apply globally.
