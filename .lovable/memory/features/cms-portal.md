---
name: CMS Portal
description: Admin CMS portal at /admin for managing homepage Hero Slides and News articles. Auth reuses CSP login + cms_admins allowlist (by email).
type: feature
---
# CMS Portal

A self-service admin portal at `/admin` lets allowlisted users edit the homepage **Hero / Featured Reviews carousel** and **News** content. CMS content **replaces** (not supplements) any equivalent content from the external CSP API.

## Architecture
- **Auth source:** existing CSP login (ExternalAuthContext access token).
- **Authorization:** `cms_admins` table keyed by lowercase email. RLS on this table denies all public reads.
- **Gateway:** `cms-admin` edge function (`supabase/functions/cms-admin/index.ts`) verifies the CSP access token by calling upstream `/account/profile`, looks up the email in `cms_admins`, then performs CRUD with the service role key.
- **Token transport:** client sends the CSP access token in the `X-CSP-Token` header when invoking the edge function (via `supabase.functions.invoke`). Never use `Authorization: Bearer <csp-token>` to call Supabase functions — that would conflict with Supabase's own JWT verification.

## Tables
- `cms_hero_slides` — homepage Featured Reviews. Public SELECT where `is_published = true`. No public writes.
- `cms_news_articles` — homepage news. Public SELECT where `is_published = true`. No public writes.
- `cms_admins` — admin allowlist. No public read; managed via SQL by the project owner.

## Storage
- Bucket `cms-media` (public) — hero/news cover images. Uploads only via the edge function (service role).

## Routes
- `/admin` — Dashboard (counts + tiles)
- `/admin/hero-slides` — Hero CRUD
- `/admin/news` — News CRUD
All wrapped in `<AdminGate>` which calls `whoami` against the edge function.

## Frontend integration
- `HeroSection.tsx` reads exclusively from `cms_hero_slides` (no longer uses `fetchFeaturedReviews`).
- `NewsSection.tsx`, `News.tsx`, `NewsArticle.tsx` read exclusively from `cms_news_articles` (no longer use the local `newsArticles` mock data).
- Service helpers live in `src/services/cmsService.ts`.

## Bootstrapping admins
Project owner manually inserts emails:
```sql
INSERT INTO public.cms_admins (email) VALUES ('owner@example.com');
```
