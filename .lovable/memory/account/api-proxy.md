---
name: Account API Proxy
description: account-proxy edge function for upstream CSP /account/profile and /account/password
type: feature
---
The `account-proxy` Supabase edge function bridges the React app to the CSP website account API at `https://api.cambridgescholars.com/api/website/account`. It accepts a single JSON body `{ action, ...payload }` where `action` is one of:

- `get_profile` — proxies `GET /profile`. No payload.
- `update_profile` — proxies `PUT /profile`. Payload accepts top-level fields (`first_name`, `last_name`, `phone`, `display_name`) and prefixed billing/shipping fields (`billing_*`, `shipping_*`) using the upstream snake_case keys (`address_1`, `address_2`, `postcode`, `country` ISO code, etc.). At least one valid field is required. `billing_email` is validated.
- `change_password` — proxies `PUT /password`. Payload `{ current_password, new_password }`. New password must be 8–128 characters.

The caller MUST forward the upstream JWT as `Authorization: Bearer <access_token>`; the proxy returns 401 if the header is missing. Per-IP rate limit is 30 requests/minute.

The legacy `manage-addresses` edge function and the local `public.addresses` table have been removed — billing and shipping live exclusively on the upstream profile.
