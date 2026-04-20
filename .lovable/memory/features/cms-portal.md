---
name: CMS Portal
description: Self-contained admin CMS portal at /admin for managing homepage Hero Slides and News. Has its own login system independent of CSP user auth.
type: feature
---
# CMS Portal

A self-contained admin portal at `/admin` lets administrators edit the homepage **Hero / Featured Reviews carousel** and **News** content. CMS content **replaces** (not supplements) any equivalent content from the external CSP API.

## Architecture
- **Auth source:** **Independent admin accounts** stored in `cms_admin_accounts` (separate from CSP/public users). Email + bcrypt-hashed password.
- **Session:** signed JWT (HS256, 12h expiry) issued by the `cms-admin` edge function, stored in `localStorage` (`cms_admin_token`, `cms_admin_user`).
- **Gateway:** `cms-admin` edge function (`supabase/functions/cms-admin/index.ts`) handles `login`, `whoami`, all CRUD, and admin account management. Uses service role key.
- **Token transport:** client sends the admin JWT in the `X-Admin-Token` header on every call (via `supabase.functions.invoke`). Never use `Authorization: Bearer` to call Supabase functions — that conflicts with Supabase's own JWT verification.
- **JWT signing key:** `CMS_ADMIN_JWT_SECRET` env var. **Required** for production.

## Tables
- `cms_hero_slides` — homepage Featured Reviews. Public SELECT where `is_published = true`. No public writes.
- `cms_news_articles` — homepage news. Public SELECT where `is_published = true`. No public writes.
- `cms_admin_accounts` — admin accounts (email + password_hash + is_active). **No public read or write.** Managed exclusively via the edge function.

## Storage
- Bucket `cms-media` (public) — hero/news cover images. Uploads only via the edge function (service role).

## Routes
- `/admin/login` — Admin login page (public)
- `/admin` — Dashboard (counts + tiles) [gated]
- `/admin/hero-slides` — Hero CRUD [gated]
- `/admin/news` — News CRUD [gated]
- `/admin/admins` — Manage admin accounts (add/remove/disable/reset password) [gated]

`<AdminGate>` calls `whoami` on mount; if the JWT is missing/invalid it redirects to `/admin/login`.

## Frontend integration
- `HeroSection.tsx` reads exclusively from `cms_hero_slides`.
- `NewsSection.tsx`, `News.tsx`, `NewsArticle.tsx` read exclusively from `cms_news_articles`.
- Service helpers and `adminSession` live in `src/services/cmsService.ts`.

## Bootstrapping the first admin
The first admin is created by an AI/operator using the `create_admin` action on the edge function (with the service role bypassing the JWT check via direct DB insert), or via SQL with a pre-computed bcrypt hash. After that, all admin management is done via the `/admin/admins` UI.
